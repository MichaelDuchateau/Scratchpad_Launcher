const { contextBridge, ipcRenderer, webUtils } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  openUrl: (url) => ipcRenderer.invoke('open-url', url),
  getPathForFile: (file) => webUtils.getPathForFile(file)
})
