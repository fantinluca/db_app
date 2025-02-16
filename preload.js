const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})

contextBridge.exposeInMainWorld('constants', {
  defaultDB: "C:/Users/ferra/OneDrive/Desktop/Programmi vari/db_app/reference/gestione_patrimoniale.db",
  defaultTable: "Giornalini"
})

contextBridge.exposeInMainWorld('api', {
  printLog: (message) => ipcRenderer.send("main:printLog", message),
  selectFile: (fileOption) => ipcRenderer.invoke("main:selectFile", fileOption),
  prepareDb: (path) => ipcRenderer.invoke("main:prepareDb", path),
  fetchDb: (query, values="") => ipcRenderer.invoke("main:fetchDb", query, values),
  setTablesMenu: () => ipcRenderer.send("main:setTablesMenu"),
  onDisplayTable: (callback) => ipcRenderer.on("displayTable", (event, value) => callback(value)),
})