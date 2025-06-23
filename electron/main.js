import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import Store from 'electron-store';

const store = new Store();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

let quitting = false;
app.on('will-quit', (event) => {
  if (quitting) {
    return; // Avoid re-entry if app.quit() is called again
  }
  quitting = true;
  console.log('[Main] app.will-quit: Application is about to quit.');
  // Prevent immediate quit
  event.preventDefault();

  // Give some time for any pending async operations (like electron-store writes)
  // to complete. 300ms is a pragmatic choice.
  setTimeout(() => {
    console.log('[Main] app.will-quit: Proceeding with quit after delay.');
    app.quit(); // This will now quit without re-triggering the delay logic
  }, 300);
});

// Handle data persistence
ipcMain.handle('store-get', (event, key) => {
  try {
    console.log(`[Main] store-get: Attempting to get key '${key}'`);
    const value = store.get(key);
    console.log(`[Main] store-get: Successfully retrieved key '${key}'. Value found: ${value !== undefined}`);
    return value;
  } catch (error) {
    console.error(`[Main] store-get: Error getting key '${key}':`, error);
    return undefined; // Return undefined to mimic key not found on error
  }
});

ipcMain.handle('store-set', (event, key, value) => {
  try {
    console.log(`[Main] store-set: Attempting to set key '${key}'. Value type: ${typeof value}, Array length (if applicable): ${Array.isArray(value) ? value.length : 'N/A'}`);
    store.set(key, value);
    console.log(`[Main] store-set: Successfully set key '${key}'`);
  } catch (error) {
    console.error(`[Main] store-set: Error setting key '${key}':`, error);
    // Optionally, re-throw or handle as needed, for now, just log
  }
});