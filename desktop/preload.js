const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('bombkitDesktop',Object.freeze({
  exportScripts:(content)=>ipcRenderer.invoke('export-scripts',content),
  importScripts:()=>ipcRenderer.invoke('import-scripts'),
}));
