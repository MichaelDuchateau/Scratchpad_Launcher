const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')

function getDataPath() {
  return path.join(app.getPath('userData'), 'scratchpad-links.json')
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 800,
    minHeight: 600,
    title: 'Scratchpad Launcher',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('load-data', () => {
  const dataPath = getDataPath()
  if (fs.existsSync(dataPath)) {
    try {
      return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    } catch {
      return null
    }
  }
  return null
})

ipcMain.handle('save-data', (_event, data) => {
  fs.writeFileSync(getDataPath(), JSON.stringify(data, null, 2))
})

ipcMain.handle('open-url', (_event, url) => {
  shell.openExternal(url)
})
