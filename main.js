const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

const dataFilePath = path.join(app.getPath('userData'), 'data.json');

// Initialize data file if it doesn't exist
function initDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    const defaultData = {
      passwords: [],
      apiKeys: []
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    vibrancy: 'sidebar',
    visualEffectState: 'active'
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'frontend/dist/index.html'));
  }
}

app.whenReady().then(() => {
  initDataFile();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-data', async () => {
  try {
    const data = await fs.promises.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read data:', error);
    return { passwords: [], apiKeys: [] };
  }
});

ipcMain.handle('save-data', async (event, data) => {
  try {
    await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    console.error('Failed to save data:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('export-data', async () => {
  try {
    const data = await fs.promises.readFile(dataFilePath, 'utf8');
    const { filePath } = await dialog.showSaveDialog({
      title: 'Export Data',
      defaultPath: 'my-app-data.json',
      filters: [{ name: 'JSON Files', extensions: ['json'] }]
    });

    if (filePath) {
      await fs.promises.writeFile(filePath, data, 'utf8');
      return { success: true, path: filePath };
    }
    return { success: false, error: 'Cancelled' };
  } catch (error) {
    console.error('Failed to export data:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('import-data', async () => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Import Data',
      properties: ['openFile'],
      filters: [{ name: 'JSON Files', extensions: ['json'] }]
    });

    if (filePaths && filePaths.length > 0) {
      const importedDataStr = await fs.promises.readFile(filePaths[0], 'utf8');
      const importedData = JSON.parse(importedDataStr);

      // Basic validation
      if (importedData && (Array.isArray(importedData.passwords) || Array.isArray(importedData.apiKeys))) {
        // Merge or replace data. Here we replace for simplicity.
        await fs.promises.writeFile(dataFilePath, JSON.stringify(importedData, null, 2), 'utf8');
        return { success: true, data: importedData };
      } else {
        return { success: false, error: 'Invalid data format' };
      }
    }
    return { success: false, error: 'Cancelled' };
  } catch (error) {
    console.error('Failed to import data:', error);
    return { success: false, error: error.message };
  }
});
