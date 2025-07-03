import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { promises as fs } from 'fs';

const dataFilePath = join(app.getPath('userData'), 'tobari-data.json');
const tempDataFilePath = join(app.getPath('userData'), 'tobari-data.json.tmp');

async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {}; // Return empty object if file doesn't exist
    }
    console.error('Failed to read data:', error);
    return {};
  }
}

async function writeData(data) {
  try {
    await fs.writeFile(tempDataFilePath, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tempDataFilePath, dataFilePath);
  } catch (error) {
    console.error('Failed to write data:', error);
  }
}

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

// Handle data persistence
ipcMain.handle('store-get', async (event, key) => {
  const data = await readData();
  return data[key];
});

ipcMain.handle('store-set', async (event, key, value) => {
  const data = await readData();
  data[key] = value;
  await writeData(data);
});
