const { ipcRenderer } = require('electron')
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron/main')
const { join } = require('node:path')
const { configure, setSync, getSync, file, hasSync } = require('electron-settings')
const isMac = (process.platform == "darwin")
const sqlite = require('sqlite-electron')

function printLog(event, message) {console.log(message)}

async function setTablesMenu() {
  let result = await fetchDb(null, "SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%'", "")

  curWin = BrowserWindow.getAllWindows()[0]

  options = []
  result.forEach(element => {
    options.push({
      label: element["name"],
      click: () => curWin.webContents.send("displayTable", element["name"])
    })
  })
  
  tablesMenu = Menu.buildFromTemplate([
    {
      label: "Cambia tabella",
      submenu: options
    }
  ])
  Menu.setApplicationMenu(tablesMenu)
}

function changePage(event, path) {
  setSync("db_path", path)
  curWin = BrowserWindow.getAllWindows()[0].loadFile("htmls/db_view.html")
}

function getDbPath() { 
  tmp = getSync("db_path")
  console.log(tmp)
  return tmp
}

async function fileOpen(event, fileOption) {
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
    return await sqlite.setdbPath((dbPath=="") ? getDbPath() : dbPath )
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

  //settings
  configure()
  if (hasSync("db_path")) {
    tablesMenu = Menu.buildFromTemplate([
      {
        label: "Attendi"
      }
    ])
    Menu.setApplicationMenu(tablesMenu)
  
    win.loadFile('htmls/db_view.html')
  }
  else {
    win.loadFile('htmls/db_first_select.html')
  }
}

app.whenReady().then(() => {
  ipcMain.handle("main:selectFile", fileOpen)
  ipcMain.handle("main:prepareDb", prepareDb)
  ipcMain.handle("main:fetchDb", fetchDb)
  ipcMain.handle("main:getDbPath", getDbPath)
  ipcMain.on("main:changePage", changePage)
  ipcMain.on("main:printLog", printLog)
  ipcMain.on("main:setTablesMenu", setTablesMenu)

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