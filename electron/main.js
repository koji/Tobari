import { app, BrowserWindow, ipcMain } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';
import { promises as fs } from 'fs';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize electron-store with better configuration
const store = new Store({
  name: 'tobari-data', // This will create tobari-data.json in the user data directory
  defaults: {
    prompts: [],
    tags: [],
    models: [],
    images: []
  },
  // Add encryption if needed for sensitive data
  // encryptionKey: 'your-encryption-key',
  // Add serialization options for better performance
  serialize: (value) => JSON.stringify(value),
  deserialize: (value) => JSON.parse(value)
});

// Create images directory in user data
const imagesDir = join(app.getPath('userData'), 'images');
fs.mkdir(imagesDir, { recursive: true }).catch(console.error);

// Add some debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Electron store initialized at:', store.path);
  console.log('Images directory:', imagesDir);
  console.log('Store contents:', store.store);
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

// Handle data persistence using electron-store with better error handling
ipcMain.handle('store-get', async (event, key) => {
  try {
    const value = store.get(key);
    console.log(`Getting key: ${key}, value:`, value ? 'exists' : 'undefined');
    return value;
  } catch (error) {
    console.error(`Error getting key ${key}:`, error);
    return undefined;
  }
});

ipcMain.handle('store-set', async (event, key, value) => {
  try {
    console.log(`Setting key: ${key}, value type:`, typeof value, 'size:', Array.isArray(value) ? value.length : 'N/A');
    store.set(key, value);
    console.log(`Successfully saved key: ${key}`);
  } catch (error) {
    console.error(`Error setting key ${key}:`, error);
    throw error;
  }
});

// Handle image file operations
ipcMain.handle('save-image', async (event, imageId, imageData) => {
  try {
    // Remove data URL prefix to get base64 data
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const imagePath = join(imagesDir, `${imageId}.png`);

    await fs.writeFile(imagePath, buffer);
    console.log(`Image saved: ${imagePath}`);

    // Return the file path for reference
    return imagePath;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
});

ipcMain.handle('load-image', async (event, imageId) => {
  try {
    const imagePath = join(imagesDir, `${imageId}.png`);
    const buffer = await fs.readFile(imagePath);
    const base64Data = buffer.toString('base64');
    return `data:image/png;base64,${base64Data}`;
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
});

ipcMain.handle('delete-image', async (event, imageId) => {
  try {
    const imagePath = join(imagesDir, `${imageId}.png`);
    await fs.unlink(imagePath);
    console.log(`Image deleted: ${imagePath}`);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error if file doesn't exist
  }
});

// Optional: Add more store operations if needed
ipcMain.handle('store-delete', async (event, key) => {
  try {
    store.delete(key);
    console.log(`Deleted key: ${key}`);
  } catch (error) {
    console.error(`Error deleting key ${key}:`, error);
    throw error;
  }
});

ipcMain.handle('store-clear', async (event) => {
  try {
    store.clear();
    console.log('Store cleared');
  } catch (error) {
    console.error('Error clearing store:', error);
    throw error;
  }
});

ipcMain.handle('store-has', async (event, key) => {
  try {
    return store.has(key);
  } catch (error) {
    console.error(`Error checking key ${key}:`, error);
    return false;
  }
});
