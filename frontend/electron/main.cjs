const { app, BrowserWindow, ipcMain, screen, shell } = require('electron')
const { spawn } = require('node:child_process')
const fs = require('node:fs')
const http = require('node:http')
const net = require('node:net')
const path = require('node:path')
const puppeteer = require('puppeteer-core')

const WINDOW_MIN_WIDTH = 1180
const WINDOW_MIN_HEIGHT = 760
const CHROME_DEBUG_PORT = 9331
const CHROME_PROFILE_DIRECTORY = process.env.CHROME_PROFILE_DIRECTORY || 'Default'

// Source profile we seed sessions from (the user's real Chrome). Layout is stable on Windows;
// seeding is best-effort only and never required for capture to work.
const CHROME_SOURCE_USER_DATA_DIR =
  process.env.CHROME_SOURCE_USER_DATA_DIR || path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'User Data')
const CHROME_SOURCE_PROFILE = process.env.CHROME_SOURCE_PROFILE || 'Default'
const SEED_SESSIONS = process.env.ODDFIX_SEED_SESSIONS !== '0'

const defaultSites = [
  {
    key: 'superbet',
    label: 'Superbet',
    bookmaker: 'Superbet',
    url: 'https://superbet.bet.br/odds/futebol/penarol-montevideo-x-independiente-santa-fe-12386249?mdt=o',
    hostMatch: 'superbet.bet.br',
  },
  {
    key: 'bet365',
    label: 'Bet365',
    bookmaker: 'Bet365',
    url: 'https://www.bet365.bet.br/#/AC/B1/C1/D8/E194121758/F3/I1/',
    hostMatch: 'bet365.bet.br',
  },
]

const EMBEDDED_HOST = '127.0.0.1'

// Backend the embedded Nitro proxy forwards to in production. Resolved from (1) a
// runtime env var (handy on your own machine) then (2) app-config.json baked at
// build time from ODDFIX_BACKEND_URL (see electron/gen-config.cjs) — so the URL is
// NOT hardcoded in source. It still ends up in the shipped artifact: protect the
// backend with auth/rate-limit, never rely on hiding this URL.
function resolveApiProxyTarget() {
  if (process.env.ODDFIX_BACKEND_URL) {
    return process.env.ODDFIX_BACKEND_URL
  }
  try {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'app-config.json'), 'utf8'))
    if (config.apiProxyTarget) {
      return config.apiProxyTarget
    }
  } catch {
    // no baked config (dev) — falls through
  }
  return ''
}

const PROD_API_PROXY_TARGET = resolveApiProxyTarget()

let launchedChrome = null
let mainWindow
let activeContextId = null
let activeSites = defaultSites
let lastClickFingerprint = ''
let lastClickFingerprintAt = 0
let nitroProc = null
let embeddedUrl = null

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, EMBEDDED_HOST, () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

function waitForHttp(url, timeoutMs = 20000) {
  const startedAt = Date.now()

  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get(url, (res) => {
        res.resume()
        resolve()
      })
      req.on('error', () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Servidor embutido nao respondeu: ${url}`))
        } else {
          setTimeout(tryOnce, 250)
        }
      })
      req.setTimeout(1500, () => req.destroy())
    }

    tryOnce()
  })
}

// Boot the bundled Nuxt/Nitro server (.output/server) on a local port using
// Electron's own Node (ELECTRON_RUN_AS_NODE). Keeps the same-origin API proxy so
// the backend stays hidden and there is no CORS.
function logDir() {
  const dir = path.join(app.getPath('userData'), 'logs')
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

// Append a line to <userData>/logs/main.log — open this file to diagnose the app.
function logLine(message) {
  try {
    fs.appendFileSync(path.join(logDir(), 'main.log'), `[${new Date().toISOString()}] ${message}\n`)
  } catch {
    // logging best-effort
  }
}

async function startEmbeddedServer() {
  if (embeddedUrl) {
    return embeddedUrl
  }

  const serverEntry = path.join(process.resourcesPath, 'output', 'server', 'index.mjs')
  const port = await findFreePort()

  let out = 'ignore'
  try {
    out = fs.openSync(path.join(logDir(), 'nitro.log'), 'a')
  } catch {
    out = 'ignore'
  }

  logLine(`Iniciando Nitro: porta=${port} proxyTarget=${PROD_API_PROXY_TARGET || '(VAZIO!)'}`)

  nitroProc = spawn(process.execPath, [serverEntry], {
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      NITRO_HOST: EMBEDDED_HOST,
      NITRO_PORT: String(port),
      HOST: EMBEDDED_HOST,
      PORT: String(port),
      NUXT_API_PROXY_TARGET: PROD_API_PROXY_TARGET,
    },
    stdio: ['ignore', out, out],
    windowsHide: true,
  })
  nitroProc.on('error', (error) => logLine(`Nitro erro: ${error.message}`))

  const url = `http://${EMBEDDED_HOST}:${port}`
  await waitForHttp(url)
  logLine(`Nitro pronto em ${url}`)
  embeddedUrl = url
  return url
}

function setupAutoUpdates() {
  if (!app.isPackaged) {
    return
  }

  try {
    const { autoUpdater } = require('electron-updater')
    autoUpdater.autoDownload = true
    autoUpdater.autoInstallOnAppQuit = true

    const notify = (payload) => sendToRenderer('oddfix-update', payload)

    autoUpdater.on('checking-for-update', () => notify({ state: 'checking' }))
    autoUpdater.on('update-available', (info) => notify({ state: 'available', version: info.version }))
    autoUpdater.on('update-not-available', () => notify({ state: 'none' }))
    autoUpdater.on('download-progress', (progress) =>
      notify({ state: 'downloading', percent: Math.round(progress.percent || 0) }),
    )
    autoUpdater.on('update-downloaded', (info) => notify({ state: 'downloaded', version: info.version }))
    autoUpdater.on('error', (error) => {
      logLine(`updater erro: ${error?.message || error}`)
      notify({ state: 'error', message: String(error?.message || error) })
    })

    const check = () => autoUpdater.checkForUpdates().catch((error) => logLine(`check falhou: ${error?.message || error}`))
    check() // no boot
    setInterval(check, 5 * 60 * 1000) // e a cada 5 min
  } catch (error) {
    logLine(`auto-update indisponivel: ${error?.message || error}`)
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: WINDOW_MIN_WIDTH,
    minHeight: WINDOW_MIN_HEIGHT,
    title: 'OddFix Desktop',
    backgroundColor: '#0d1117',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      // DevTools/inspect OFF for users. Only ODDFIX_DEBUG=1 re-enables it (for you).
      devTools: process.env.ODDFIX_DEBUG === '1',
    },
  })

  mainWindow.removeMenu()
  if (process.env.ODDFIX_CLICK_TEST === '1') {
    mainWindow.loadFile(path.join(__dirname, 'click-test.html'))
    mainWindow.webContents.once('did-finish-load', () => launchChromeWithUserProfile())
  } else if (app.isPackaged) {
    // Production: boot the embedded Nitro server and load it.
    startEmbeddedServer()
      .then((url) => mainWindow.loadURL(url))
      .catch((error) => {
        console.error('[oddfix] servidor embutido falhou:', error)
        mainWindow.loadFile(path.join(__dirname, 'click-test.html'))
      })
  } else {
    const rendererUrl = process.env.ODDFIX_RENDERER_URL || process.env.ELECTRON_RENDERER_URL || 'http://localhost:3000'
    mainWindow.loadURL(rendererUrl).catch(() => {
      mainWindow.loadFile(path.join(__dirname, 'click-test.html'))
    })
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // DevTools is disabled for users (devTools:false above). Only ODDFIX_DEBUG=1 brings
  // back inspection (F12 / Ctrl+Shift+I toggle + auto-open) so YOU can diagnose.
  if (process.env.ODDFIX_DEBUG === '1') {
    mainWindow.webContents.on('before-input-event', (_event, input) => {
      const key = (input.key || '').toLowerCase()
      if (key === 'f12' || (input.control && input.shift && key === 'i')) {
        mainWindow.webContents.toggleDevTools()
      }
    })
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }
}

function sendToRenderer(channel, payload) {
  // Broadcast to every window (main + calculator) so captured clicks/status reach all.
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) {
      win.webContents.send(channel, payload)
    }
  }
}

async function getRendererBase() {
  if (app.isPackaged) {
    return embeddedUrl || (await startEmbeddedServer())
  }
  return process.env.ODDFIX_RENDERER_URL || process.env.ELECTRON_RENDERER_URL || 'http://localhost:3000'
}

let calcWindow = null

// Open the calculator in a SEPARATE OS window (draggable to a 2nd monitor). It loads
// /calculadora and pulls its own live feed (same backend/session) so odds stay live.
async function openCalcWindow(payload) {
  const id = payload && payload.id
  if (!id) {
    return
  }
  const type = payload.type === 'live' ? 'live' : 'prematch'

  let base
  try {
    base = await getRendererBase()
  } catch {
    return
  }
  if (!base) {
    return
  }

  const url = `${base}/calculadora?id=${encodeURIComponent(id)}&type=${type}`

  if (calcWindow && !calcWindow.isDestroyed()) {
    calcWindow.loadURL(url)
    calcWindow.show()
    calcWindow.focus()
    return
  }

  // Largura: da borda esquerda até a METADE do primeiro card de jogos.
  // (sidebar 304 + padding 28 da grade + meia largura do card). Constantes do layout
  // do dashboard: grid 2 colunas acima de 1100px, senão 1 coluna.
  const { workArea } = screen.getPrimaryDisplay()
  const SIDEBAR = 304
  const GRID_PAD = 28
  const GRID_GAP = 16
  const mainWidth = Math.max(0, workArea.width - SIDEBAR)
  const twoCols = workArea.width > 1100
  const cardWidth = twoCols ? (mainWidth - GRID_PAD * 2 - GRID_GAP) / 2 : mainWidth - GRID_PAD * 2
  const calcWidth = Math.round(
    Math.min(workArea.width, Math.max(360, SIDEBAR + GRID_PAD + Math.max(0, cardWidth) / 2)),
  )

  calcWindow = new BrowserWindow({
    width: calcWidth,
    height: workArea.height,
    x: workArea.x,
    y: workArea.y,
    minWidth: 360,
    minHeight: 520,
    title: 'OddFix · Calculadora',
    backgroundColor: '#0d1117',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      devTools: process.env.ODDFIX_DEBUG === '1',
    },
  })
  calcWindow.removeMenu()
  calcWindow.loadURL(url)
  calcWindow.webContents.setWindowOpenHandler(({ url: target }) => {
    shell.openExternal(target)
    return { action: 'deny' }
  })
  calcWindow.on('closed', () => {
    calcWindow = null
  })
}

function sendStatus(site, state, message) {
  sendToRenderer('oddfix-site-status', {
    siteKey: site.key,
    state,
    message,
  })
}

function sendAllStatuses(state, message) {
  for (const site of activeSites) {
    sendStatus(site, state, message)
  }
}

function findChromeExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    path.join(process.env.ProgramFiles || '', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env['ProgramFiles(x86)'] || '', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  ].filter(Boolean)

  return candidates.find((candidate) => fs.existsSync(candidate))
}

function getChromeUserDataDir() {
  return process.env.CHROME_USER_DATA_DIR || path.join(app.getPath('userData'), 'chrome-cdp-profile')
}

function waitForDebugPort(port, timeoutMs = 15000) {
  const startedAt = Date.now()

  return new Promise((resolve, reject) => {
    const tryRequest = () => {
      const req = http.get(`http://127.0.0.1:${port}/json/version`, (res) => {
        res.resume()
        if (res.statusCode === 200) {
          resolve()
          return
        }

        retry()
      })

      req.on('error', retry)
      req.setTimeout(1000, () => {
        req.destroy()
        retry()
      })
    }

    const retry = () => {
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Chrome debug port ${port} did not become ready`))
        return
      }

      setTimeout(tryRequest, 250)
    }

    tryRequest()
  })
}

function siteForUrl(url) {
  return activeSites.find((site) => {
    try {
      const parsed = new URL(url)
      return parsed.href === site.url || (site.hostMatch && parsed.hostname.includes(site.hostMatch))
    } catch {
      return false
    }
  })
}

function siteForPayload(payload) {
  const candidates = [
    payload?.pageUrl,
    payload?.referrer,
    ...(Array.isArray(payload?.ancestorOrigins) ? payload.ancestorOrigins : []),
  ].filter(Boolean)

  for (const candidate of candidates) {
    const site = siteForUrl(candidate)
    if (site) {
      return site
    }
  }

  return null
}

function handleCapturedClick(payload) {
  const site = siteForPayload(payload)

  if (!site) {
    return
  }

  const fingerprint = `${site.key}:${payload.text}:${payload.pageUrl}`
  const now = Date.now()

  if (fingerprint === lastClickFingerprint && now - lastClickFingerprintAt < 750) {
    return
  }

  lastClickFingerprint = fingerprint
  lastClickFingerprintAt = now
  sendStatus(site, 'ready', `Clique capturado: ${payload.text}`)
  const enrichedPayload = {
    contextId: activeContextId,
    siteKey: site.key,
    bookmaker: site.bookmaker ?? site.label,
    legIndex: site.legIndex,
    ...payload,
  }

  sendToRenderer('oddfix-click-captured', enrichedPayload)
  sendToRenderer('oddfix-bookmaker-click-captured', enrichedPayload)
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getSiteBounds(index, total) {
  const displays = screen.getAllDisplays()
  const primaryDisplay = screen.getPrimaryDisplay()
  const targetDisplay = displays.find((display) => display.id !== primaryDisplay.id) || primaryDisplay
  const { x, y, width, height } = targetDisplay.workArea
  const columns = Math.max(1, total)
  const windowWidth = Math.floor(width / columns)
  const isLast = index === columns - 1

  return {
    x: x + windowWidth * index,
    y,
    width: isLast ? width - windowWidth * index : windowWidth,
    height,
  }
}

// Copy a single profile file, creating parent dirs. Never throws: a missing/locked/renamed
// source just means "not seeded", and capture falls back to a manual one-time login.
function copyProfileFile(src, dest) {
  try {
    if (!fs.existsSync(src)) {
      return false
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    return true
  } catch (error) {
    console.warn(`[oddfix] seed copy falhou (${path.basename(src)}): ${error.message}`)
    return false
  }
}

// Best-effort, one-time seed of the dedicated profile from the user's real Chrome profile.
// We copy files only and let Chrome decrypt them (same Windows user => DPAPI key matches).
// We never parse or decrypt cookies ourselves, so a future Chrome crypto/layout change can
// only make this a no-op, never a crash.
function seedDedicatedProfile(userDataDir) {
  if (!SEED_SESSIONS) {
    return
  }

  const destProfile = path.join(userDataDir, CHROME_PROFILE_DIRECTORY)
  const destCookies = path.join(destProfile, 'Network', 'Cookies')
  const marker = path.join(userDataDir, '.oddfix-seeded')

  // Already seeded, or the dedicated profile already has its own sessions -> never clobber them.
  if (fs.existsSync(marker) || fs.existsSync(destCookies)) {
    return
  }

  const src = CHROME_SOURCE_USER_DATA_DIR
  if (!src || !fs.existsSync(src)) {
    return
  }

  const srcProfile = path.join(src, CHROME_SOURCE_PROFILE)

  // Local State holds the os_crypt key (DPAPI-bound to the Windows user) that decrypts cookies.
  copyProfileFile(path.join(src, 'Local State'), path.join(userDataDir, 'Local State'))
  // Logged-in sessions.
  const cookiesCopied = copyProfileFile(path.join(srcProfile, 'Network', 'Cookies'), destCookies)
  copyProfileFile(path.join(srcProfile, 'Network', 'Cookies-journal'), path.join(destProfile, 'Network', 'Cookies-journal'))
  // Saved logins help re-auth where cookies expired or are ABE-protected (Chrome >= 127).
  copyProfileFile(path.join(srcProfile, 'Login Data'), path.join(destProfile, 'Login Data'))

  if (cookiesCopied) {
    try {
      fs.writeFileSync(marker, new Date().toISOString())
    } catch {
      // marker is just an optimization; ignore failures
    }
  }
}

function chromeBaseArgs(userDataDir) {
  return [
    `--remote-debugging-port=${CHROME_DEBUG_PORT}`,
    `--user-data-dir=${userDataDir}`,
    `--profile-directory=${CHROME_PROFILE_DIRECTORY}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-session-crashed-bubble',
    '--hide-crash-restore-bubble',
  ]
}

// Boot a single Chrome instance bound to the debug port (one blank window). The
// bookmaker windows are then created via CDP so each gets its own positioned window.
function spawnChromeBootstrap(chromePath, userDataDir) {
  const args = [...chromeBaseArgs(userDataDir), '--new-window', 'about:blank']

  return spawn(chromePath, args, {
    stdio: 'ignore',
    detached: true,
    windowsHide: false,
  })
}

function installClickCapture() {
  if (window.__oddfixChromeClickCaptureInstalled) {
    return
  }

  window.__oddfixChromeClickCaptureInstalled = true

  const cleanText = (value) =>
    String(value || '')
      .replace(/\s+/g, ' ')
      .trim()

  const describeElement = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return null
    }

    const attrs = ['aria-label', 'title', 'data-testid', 'data-test', 'data-qa', 'alt']
    const attrText = attrs.map((name) => cleanText(element.getAttribute(name))).find(Boolean)
    const valueText = 'value' in element ? cleanText(element.value) : ''
    const innerText = cleanText(element.innerText || element.textContent)
    const text = attrText || valueText || innerText

    return {
      tag: element.tagName.toLowerCase(),
      role: cleanText(element.getAttribute('role')),
      type: cleanText(element.getAttribute('type')),
      classes: cleanText(element.className).slice(0, 160),
      text: text.slice(0, 300),
    }
  }

  const scoreCandidate = (element, index) => {
    const text = cleanText(element.innerText || element.textContent)
    const tag = element.tagName.toLowerCase()
    const role = cleanText(element.getAttribute('role'))
    const hasDirectValue = Boolean(cleanText(element.getAttribute('aria-label')) || ('value' in element && cleanText(element.value)))
    const isNativeAction = ['button', 'a', 'input'].includes(tag) || role === 'button'
    const hasClickHint = Boolean(element.onclick || element.getAttribute('onclick'))
    const attrs = Array.from(element.attributes || []).map((attr) => `${attr.name}=${attr.value}`).join(' ')
    const hasBetHint = /odd|price|market|selection|bet|coupon|outcome|event/i.test(`${element.className || ''} ${element.id || ''} ${attrs}`)

    let score = Math.max(0, 80 - index * 6)

    if (isNativeAction) score += 80
    if (hasDirectValue) score += 35
    if (hasClickHint) score += 20
    if (hasBetHint) score += 18
    if (text.length >= 1 && text.length <= 80) score += 30
    if (text.length > 120) score -= 45

    return score
  }

  const findClickedElement = (event) => {
    const path = typeof event.composedPath === 'function' ? event.composedPath() : []
    const elements = path.filter((node) => node && node.nodeType === Node.ELEMENT_NODE)

    if (!elements.length && event.target && event.target.nodeType === Node.ELEMENT_NODE) {
      elements.push(event.target)
    }

    const candidates = elements
      .slice(0, 8)
      .filter((element) => {
        const description = describeElement(element)
        return description && description.text
      })

    if (!candidates.length) {
      return event.target
    }

    return candidates
      .map((element, index) => ({ element, score: scoreCandidate(element, index) }))
      .sort((a, b) => b.score - a.score)[0].element
  }

  document.addEventListener(
    'click',
    (event) => {
      const description = describeElement(findClickedElement(event))

      if (!description || !description.text || typeof window.__oddfixReportClick !== 'function') {
        return
      }

      window.__oddfixReportClick({
        ...description,
        pageUrl: window.location.href,
        referrer: document.referrer,
        ancestorOrigins: Array.from(window.location.ancestorOrigins || []),
        clickedAt: new Date().toISOString(),
      })
    },
    true,
  )

  if (typeof window.__oddfixReportReady === 'function') {
    window.__oddfixReportReady({
      pageUrl: window.location.href,
      referrer: document.referrer,
      ancestorOrigins: Array.from(window.location.ancestorOrigins || []),
      clickedAt: new Date().toISOString(),
    })
  }
}

async function attachCaptureToPage(page) {
  if (page.__oddfixCaptureAttached) {
    return
  }

  page.__oddfixCaptureAttached = true

  await page.exposeFunction('__oddfixReportClick', handleCapturedClick).catch(() => undefined)
  await page.exposeFunction('__oddfixReportReady', (payload) => {
    const site = siteForPayload(payload)
    if (site) {
      sendStatus(site, 'ready', 'Captura CDP injetada na pagina')
    }
  }).catch(() => undefined)

  await page.evaluateOnNewDocument(installClickCapture)
  await page.evaluate(installClickCapture).catch(() => undefined)
}

async function attachCaptureToBrowser(browser) {
  const attachTarget = async (target) => {
    if (target.type() !== 'page') {
      return
    }

    const page = await target.page()
    if (page) {
      await attachCaptureToPage(page).catch((error) => {
        sendAllStatuses('error', `Falha ao injetar captura: ${error.message}`)
      })
    }
  }

  browser.on('targetcreated', attachTarget)
  browser.on('targetchanged', attachTarget)

  for (const page of await browser.pages()) {
    await attachCaptureToPage(page)
  }
}

let captureAttachedTo = null

// Connect Puppeteer to the debug instance (reusing an existing connection) and
// attach click capture exactly once.
async function getBrowser() {
  if (launchedChrome?.browser && launchedChrome.browser.connected) {
    return launchedChrome.browser
  }

  await waitForDebugPort(CHROME_DEBUG_PORT)
  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${CHROME_DEBUG_PORT}`,
    defaultViewport: null,
  })
  launchedChrome = { ...launchedChrome, browser }

  if (captureAttachedTo !== browser) {
    captureAttachedTo = browser
    await attachCaptureToBrowser(browser)
  }

  return browser
}

// Open each bookmaker as its OWN new window via CDP and tile them side by side.
// Deterministic: one window per site, positioned immediately by its target id —
// no tabs, no stacking, no fragile URL matching.
async function openSitesTiled(browser) {
  const total = activeSites.length
  if (total === 0) {
    return
  }

  const client = await browser.target().createCDPSession()
  // Everything already open in this dedicated instance is from a previous launch
  // (the bootstrap blank window or a prior surebet) — close it once the new ones are up.
  const stalePages = await browser.pages()

  for (let index = 0; index < total; index += 1) {
    const site = activeSites[index]
    const bounds = getSiteBounds(index, total)

    try {
      const { targetId } = await client.send('Target.createTarget', { url: site.url, newWindow: true })
      const { windowId } = await client.send('Browser.getWindowForTarget', { targetId })
      // windowState cannot be combined with left/top/width/height -> two calls.
      await client.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'normal' } })
      await client.send('Browser.setWindowBounds', {
        windowId,
        bounds: { left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height },
      })
    } catch (error) {
      sendStatus(site, 'error', `Falha ao abrir janela: ${error.message}`)
    }
  }

  for (const page of stalePages) {
    await page.close().catch(() => undefined)
  }

  await client.detach().catch(() => undefined)
}

function normalizeBookmakerPayload(payload) {
  if (!payload || !Array.isArray(payload.legs)) {
    return { contextId: null, sites: defaultSites }
  }

  const normalizedSites = payload.legs
    .map((leg, index) => {
      if (!leg?.url) {
        return null
      }

      let hostMatch = ''
      try {
        hostMatch = new URL(leg.url).hostname.replace(/^www\./, '')
      } catch {
        hostMatch = ''
      }

      const bookmaker = String(leg.bookmaker || leg.bookmakerKey || `Casa ${index + 1}`)

      return {
        key: String(leg.bookmakerKey || `${bookmaker}-${index}`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        label: bookmaker,
        bookmaker,
        legIndex: index,
        url: leg.url,
        hostMatch,
      }
    })
    .filter(Boolean)

  return {
    contextId: payload.contextId ?? payload.surebetId ?? null,
    sites: normalizedSites.length ? normalizedSites : defaultSites,
  }
}

async function launchChromeWithUserProfile(payload = null) {
  const normalized = normalizeBookmakerPayload(payload)
  activeContextId = normalized.contextId
  activeSites = normalized.sites

  const chromePath = findChromeExecutable()
  if (!chromePath) {
    sendAllStatuses('error', 'Chrome nao encontrado')
    return
  }

  const userDataDir = getChromeUserDataDir()
  fs.mkdirSync(userDataDir, { recursive: true })
  seedDedicatedProfile(userDataDir)

  activeSites.forEach((site) => {
    sendStatus(site, 'loading', 'Abrindo janela da casa')
  })

  // Ensure a debug-enabled Chrome instance exists (boot one blank window if needed).
  if (!launchedChrome?.browser || !launchedChrome.browser.connected) {
    const child = spawnChromeBootstrap(chromePath, userDataDir)
    launchedChrome = { child, browser: null }
    try {
      await waitForDebugPort(CHROME_DEBUG_PORT)
    } catch (error) {
      sendAllStatuses('error', `Chrome debug indisponivel: ${error.message}`)
      return
    }
  }

  let browser
  try {
    browser = await getBrowser()
  } catch (error) {
    sendAllStatuses('error', `CDP indisponivel: ${error.message}`)
    return
  }

  // One positioned window per house, side by side.
  await openSitesTiled(browser)
  sendAllStatuses('ready', 'Capturando cliques por CDP no perfil OddFix')
}

app.whenReady().then(() => {
  // Match the NSIS appId so Windows ties the running app to the installed shortcut
  // (correct taskbar/jump-list icon + grouping + notifications).
  app.setAppUserModelId('com.oddfix.desktop')
  createWindow()
  setupAutoUpdates()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

ipcMain.handle('oddfix-launch-sites', () => {
  launchChromeWithUserProfile()
})

ipcMain.handle('oddfix-open-bookmakers', (_event, payload) => {
  launchChromeWithUserProfile(payload)
})

ipcMain.handle('oddfix-open-site', async (_event, siteKey) => {
  const site = activeSites.find((candidate) => candidate.key === siteKey)

  if (!site) {
    launchChromeWithUserProfile()
    return
  }
})

ipcMain.handle('oddfix-open-calculator', (_event, payload) => openCalcWindow(payload || {}))

// User clicked "Reiniciar agora" on the update toast.
ipcMain.handle('oddfix-install-update', () => {
  if (!app.isPackaged) {
    return
  }
  try {
    require('electron-updater').autoUpdater.quitAndInstall()
  } catch (error) {
    logLine(`quitAndInstall: ${error?.message || error}`)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  launchedChrome?.browser?.disconnect()
  if (nitroProc) {
    try {
      nitroProc.kill()
    } catch {
      // já encerrado
    }
  }
})
