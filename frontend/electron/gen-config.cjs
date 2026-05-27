// Build-time config generator. Reads ODDFIX_BACKEND_URL from the build environment
// and writes electron/app-config.json (gitignored) that ships inside the app.
// NOTE: this is config management, NOT secrecy — the value still lives in the built
// artifact. Keep real protection on the backend (auth, rate-limit, per-machine access).
const fs = require('node:fs')
const path = require('node:path')

// Load frontend/.env so ODDFIX_BACKEND_URL can live there (no need to export it each
// build). Real process.env (e.g. CI secret) always wins over the file.
function loadDotEnv(file) {
  try {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
      if (!match) continue
      const key = match[1]
      const value = match[2].replace(/^["']|["']$/g, '')
      if (!(key in process.env)) process.env[key] = value
    }
  } catch {
    // no .env — fine
  }
}

loadDotEnv(path.join(__dirname, '..', '.env'))

const target = process.env.ODDFIX_BACKEND_URL || ''
if (!target) {
  console.warn('[oddfix] ODDFIX_BACKEND_URL nao definido — app-config.json sai VAZIO (app nao busca dados).')
}

const out = path.join(__dirname, 'app-config.json')
fs.writeFileSync(out, `${JSON.stringify({ apiProxyTarget: target }, null, 2)}\n`)
console.log(`[oddfix] app-config.json gerado (apiProxyTarget=${target ? 'definido' : 'VAZIO'})`)
