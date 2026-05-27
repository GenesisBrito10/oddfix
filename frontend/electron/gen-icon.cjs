// Regenerate app icons from electron/icon.svg. Run: pnpm icons
// Outputs (committed): build/icon.ico (Windows exe + NSIS), build/icon.png (linux/mac),
// electron/icon.png (BrowserWindow), public/favicon.ico (web tab).
const fs = require('node:fs')
const path = require('node:path')
const { Resvg } = require('@resvg/resvg-js')
const pngToIcoModule = require('png-to-ico')
const pngToIco = pngToIcoModule.default || pngToIcoModule

const root = path.join(__dirname, '..')
const svg = fs.readFileSync(path.join(__dirname, 'icon.svg'))

const renderPng = (size) =>
  Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng())

;(async () => {
  fs.mkdirSync(path.join(root, 'build'), { recursive: true })

  // Multi-resolution .ico for Windows (exe + installer).
  const icoSizes = [16, 24, 32, 48, 64, 128, 256]
  fs.writeFileSync(path.join(root, 'build', 'icon.ico'), await pngToIco(icoSizes.map(renderPng)))

  // PNGs: build/ (electron-builder linux/mac) + electron/ (BrowserWindow, shipped in asar).
  fs.writeFileSync(path.join(root, 'build', 'icon.png'), renderPng(512))
  fs.writeFileSync(path.join(__dirname, 'icon.png'), renderPng(256))

  // Web favicon.
  fs.writeFileSync(path.join(root, 'public', 'favicon.ico'), await pngToIco([16, 32, 48].map(renderPng)))

  console.log('[oddfix] icons gerados: build/icon.ico, build/icon.png, electron/icon.png, public/favicon.ico')
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
