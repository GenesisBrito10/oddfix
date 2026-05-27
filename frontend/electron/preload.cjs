const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('oddfixElectron', {
  sites: {
    superbet: 'https://superbet.bet.br/odds/futebol/penarol-montevideo-x-independiente-santa-fe-12386249?mdt=o',
    bet365: 'https://www.bet365.bet.br/#/AC/B1/C1/D8/E194121758/F3/I1/',
  },
  launchSites: () => ipcRenderer.invoke('oddfix-launch-sites'),
  openSite: (siteKey) => ipcRenderer.invoke('oddfix-open-site', siteKey),
  openBookmakers: (payload) => ipcRenderer.invoke('oddfix-open-bookmakers', payload),
  onCapture: (callback) => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('oddfix-click-captured', listener)
    return () => ipcRenderer.removeListener('oddfix-click-captured', listener)
  },
  onStatus: (callback) => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('oddfix-site-status', listener)
    return () => ipcRenderer.removeListener('oddfix-site-status', listener)
  },
  onBookmakerClick: (callback) => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('oddfix-bookmaker-click-captured', listener)
    return () => ipcRenderer.removeListener('oddfix-bookmaker-click-captured', listener)
  },
  onUpdate: (callback) => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('oddfix-update', listener)
    return () => ipcRenderer.removeListener('oddfix-update', listener)
  },
  installUpdate: () => ipcRenderer.invoke('oddfix-install-update'),
  openCalculator: (id, type) => ipcRenderer.invoke('oddfix-open-calculator', { id, type }),
})
