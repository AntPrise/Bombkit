const { app, BrowserWindow, ipcMain, dialog, session, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
const MAX_IMPORT_BYTES = 5_000_000;
let win;
function createWindow() {
  win = new BrowserWindow({width:1280,height:820,minWidth:820,minHeight:550,backgroundColor:'#080b12',webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true}});
  win.loadFile(path.join(__dirname,'../app/index.html'));
  win.webContents.setWindowOpenHandler(({url}) => {
    try { const parsed=new URL(url);if(parsed.protocol==='https:' && ['github.com','gameofbombs.com'].includes(parsed.hostname)) void shell.openExternal(url); } catch {}
    return {action:'deny'};
  });
  win.webContents.on('will-navigate',(event)=>event.preventDefault());
}
app.whenReady().then(()=>{
  session.defaultSession.setPermissionRequestHandler((_webContents,_permission,callback)=>callback(false));
  createWindow();
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
ipcMain.handle('export-scripts',async(event,content)=>{
  if (event.sender!==win?.webContents || typeof content!=='string' || Buffer.byteLength(content)>MAX_IMPORT_BYTES) return {ok:false};
  try { JSON.parse(content);const {canceled,filePath}=await dialog.showSaveDialog(win,{title:'Export scripts',defaultPath:'bombkit-scripts.json',filters:[{name:'JSON',extensions:['json']}]});if(canceled||!filePath)return {ok:false};await fs.writeFile(filePath,content,'utf8');return {ok:true}; }catch{return {ok:false};}
});
ipcMain.handle('import-scripts',async(event)=>{
  if(event.sender!==win?.webContents)return {ok:false};
  const {canceled,filePaths}=await dialog.showOpenDialog(win,{title:'Import scripts',properties:['openFile'],filters:[{name:'JSON',extensions:['json']}]});
  if(canceled||filePaths.length!==1)return {ok:false};
  try {const stat=await fs.stat(filePaths[0]);if(stat.size>MAX_IMPORT_BYTES)return {ok:false};const content=await fs.readFile(filePaths[0],'utf8');return {ok:true,content};}catch{return {ok:false};}
});
