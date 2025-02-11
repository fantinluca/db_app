const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const { join } = require('node:path')
const isMac = (process.platform == "darwin")
const sqlite = require('sqlite-electron')

async function fileOpen(event, fileOption) {
  printLog(event, fileOption)

  let fileOptions
  switch (fileOption) {
    case "img":
      fileOptions = [
          {"name":"img", "extensions":["jpg","jpeg","png","gif","bmp"]}
      ]
      break;
    case "pdf":
      fileOptions = [
          {"name":"pdf", "extensions":["pdf"]}
      ]
      break;
    case "sql":
      fileOptions = [
          {"name":"sql", "extensions":["db"]}
      ]
      break;
  }

  const { canceled, filePaths } = await dialog.showOpenDialog({filters: fileOptions})
  if (!canceled) return filePaths[0]
}

async function prepareDb(event, dbPath) {
  try {
    return await sqlite.setdbPath(dbPath)
  } catch (error) {
    console.log(error)
    return error
  }
}

async function fetchDb(event, query, values) {
  try {
    const val_arr = JSON.parse("[" + values + "]")
    let result = await sqlite.fetchAll(query, val_arr[0])
    return result
  } catch (error) {
    return error
  }
}

function printLog(event, message) {console.log(message)}

const createWindow = () => {
  const win = new BrowserWindow({ 
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  ipcMain.handle("main:selectFile", fileOpen)
  ipcMain.handle("main:prepareDb", prepareDb)
  ipcMain.handle("main:fetchDb", fetchDb)
  ipcMain.on("main:printLog", printLog)
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (!isMac) app.quit()
})