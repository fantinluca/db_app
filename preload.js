const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})

contextBridge.exposeInMainWorld('constants', {
  defaultDB: "gestione_patrimoniale.db",
  defaultTable: "Giornalini"
})

contextBridge.exposeInMainWorld('api', {
  selectFile: (fileOption) => ipcRenderer.invoke("main:selectFile", fileOption),
  prepareDb: (path="") => ipcRenderer.invoke("main:prepareDb", path),
  fetchDb: (query, values="") => ipcRenderer.invoke("main:fetchDb", query, values),
  getDbPath: () => ipcRenderer.invoke("main:getDbPath"),
  printLog: (message) => ipcRenderer.send("main:printLog", message),
  setTablesMenu: () => ipcRenderer.send("main:setTablesMenu"),
  changePage: (path) => ipcRenderer.send("main:changePage", path),
  onDisplayTable: (callback) => ipcRenderer.on("displayTable", (event, value) => callback(value)),
})