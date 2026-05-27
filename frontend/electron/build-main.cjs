// Bundle the Electron main process into a single self-contained file so packaging
// never depends on electron-builder tracing node_modules (pnpm + builder miss
// transitive deps like `ms`). Everything (puppeteer-core, electron-updater, ...)
// is inlined; only `electron` stays external (provided by the runtime).
const path = require('node:path')
const esbuild = require('esbuild')

esbuild
  .build({
    entryPoints: [path.join(__dirname, 'main.cjs')],
    outfile: path.join(__dirname, 'main.bundle.cjs'),
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    external: ['electron'],
    logLevel: 'info',
    // puppeteer-core has optional dynamic requires (browser download path) we never
    // hit (we only puppeteer.connect). Don't fail the build on them.
    logOverride: { 'unsupported-require-call': 'warning' },
  })
  .then(() => console.log('[oddfix] electron/main.bundle.cjs gerado'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
