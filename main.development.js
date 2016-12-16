/* eslint-disable no-console */
import { app, Tray, BrowserWindow, ipcMain, webContents } from 'electron';
import path from 'path';
import installExtension,
  { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';

global.appDir = __dirname;
global.sharedObj = {
  lastScreenshotPath: '',
  screenshotTime: null,
  currentWorklogId: null,
};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

process.on('uncaughtExecption', () => {
  console.error('Uncaught exception in main process');
});

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') app.quit();
});

let mainWindow;

function createWindow() {
  // disabling chrome frames differ on OSX and other platforms
  // https://github.com/electron/electron/blob/master/docs/api/frameless-window.md
  const noFrameOption = process.platform === 'darwin'
    ? { titleBarStyle: 'hidden' }
    : { frame: false };

  mainWindow = new BrowserWindow({
    show: false,
    width: 575,
    height: 475,
    ...noFrameOption,
  });

  mainWindow.loadURL(`file://${__dirname}/src/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('ready-to-show', () => {
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
    mainWindow.show();
    mainWindow.focus();
  });
}

function initializeApp() {
  if (process.env.NODE_ENV === 'development') {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(
        name => console.log(`Installed ${name} extension`),
        error => console.error(`Error while installing extension ${error}`)
      );
    installExtension(REDUX_DEVTOOLS)
      .then(
        name => {
          console.log(`Installed ${name} extension`);
          // create window after installing extensions
          console.log('Creating window...');
          createWindow();
        },
        error => console.error(`Error while installing extension ${error}`)
      );
  } else {
    createWindow();
  }
}

ipcMain.on('screenshot-reject', () => {
  mainWindow.webContents.send('screenshot-reject');
});

ipcMain.on('screenshot-accept', () => {
  mainWindow.webContents.send('screenshot-accept');
});

let tray = null;

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, './src/assets/images/clock.png'));
  tray.setToolTip('Open chronos tracker');
  tray.on('click', () => mainWindow.show());
  initializeApp();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

