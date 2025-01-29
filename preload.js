const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})

contextBridge.exposeInMainWorld('api', {
    printLog: (message) => ipcRenderer.send("main:printLog", message),
    selectFile: (fileOption) => ipcRenderer.invoke("main:selectFile", fileOption),
    prepareDb: () => ipcRenderer.invoke("main:prepareDb"),
    fetchDb: (query, values="") => ipcRenderer.invoke("main:fetchDb", query, values)
})