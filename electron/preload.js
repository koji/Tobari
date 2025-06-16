const { contextBridge, ipcRenderer } = require('electron');

// Expose electron APIs to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key) => ipcRenderer.invoke('store-get', key),
    set: (key, value) => ipcRenderer.invoke('store-set', key, value)
  }
});

