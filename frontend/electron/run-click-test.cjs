const { spawn } = require('node:child_process')
const path = require('node:path')
const electronPath = require('electron')

const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE
env.ODDFIX_CLICK_TEST = '1'

const child = spawn(electronPath, [path.join(__dirname, 'main.cjs')], {
  env,
  stdio: 'inherit',
})

child.on('close', (code) => {
  process.exit(code ?? 0)
})
