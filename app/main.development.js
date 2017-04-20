/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
/* global sharedObj */
// @flow
import path from 'path';
import storage from 'electron-json-storage';
import { app, Tray, ipcMain, BrowserWindow, screen } from 'electron';
import updater from 'electron-simple-updater';
import MenuBuilder from './menu';

let mainWindow;
let tray;
let authWindow;
let shouldQuit = process.platform !== 'darwin';

updater.init({
  checkUpdateOnStart: false,
  autoDownload: false,
});

global.appDir = app.getPath('userData');
global.appSrcDir = __dirname;
global.sharedObj = {
  running: false,
  uploading: false,
  lastScreenshotPath: '',
  lastScreenshotThumbPath: '',
  screenshotTime: null,
  timestamp: null,
  idleTime: 0,
  idleDetails: {},
};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

process.on('uncaughtExecption', (err) => {
  console.error('Uncaught exception in main process', err);
});


const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
    tray.destroy();
  }
});


function checkRunning(e) {
  const contentSize = mainWindow.getContentSize();
  const lastWindowSize = {
    width: contentSize[0],
    height: contentSize[1],
  };
  storage.set('lastWindowSize', lastWindowSize, (err) => {
    if (err) {
      console.log('error saving last window size', err);
    } else {
      console.log('saved last window size');
    }
  });
  if (sharedObj.running || sharedObj.uploading) {
    console.log('RUNNING');
    mainWindow.webContents.send('force-save');
    e.preventDefault();
    shouldQuit = false;
  }
}


function createWindow(callback) {
  // disabling chrome frames differ on OSX and other platforms
  // https://github.com/electron/electron/blob/master/docs/api/frameless-window.md
  const noFrameOption = {};
  switch (process.platform) {
    case 'darwin':
      noFrameOption.titleBarStyle = 'hidden';
      break;
    case 'linux':
    case 'windows':
      noFrameOption.frame = true;
      break;
    default:
      break;
  }
  storage.get('lastWindowSize', (err, data) => {
    if (err) {
      console.log(err);
    }
    const lastWindowSize = data || {};
    mainWindow = new BrowserWindow({
      show: false,
      width: lastWindowSize.width || 810,
      height: lastWindowSize.height || 675,
      minWidth: 710,
      minHeight: 640,
      ...noFrameOption,
    });
    callback();

    mainWindow.loadURL(`file://${__dirname}/app.html`);
    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    mainWindow.on('ready-to-show', () => {
      if (process.env.NODE_ENV === 'development' || process.env.SHOW_DEVTOOLS) {
        mainWindow.webContents.openDevTools();
      }
      mainWindow.show();
      mainWindow.focus();
    });

    mainWindow.on('close', (e) => {
      if (process.platform !== 'darwin') {
        checkRunning(e);
      }
      if (!shouldQuit) {
        e.preventDefault();
        if (process.platform === 'darwin') {
          mainWindow.hide();
        }
      } else if (process.platform === 'darwin') {
        checkRunning(e);
      }
    });
  });
}


ipcMain.on('showScreenPreviewPopup', () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const options = {
    width: 218,
    height: 212,
    x: width - 218,
    y: height - 212,
    frame: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    show: false,
  };
  const win = new BrowserWindow(options);
  win.loadURL(`file://${__dirname}/screenPopup.html`);
  win.once('ready-to-show', () => {
    win.show();
  });
});

ipcMain.on('oauthText', (event, text) => {
  try {
    const code = text.split('.')[1].split('\'')[1];
    mainWindow.webContents.send('oauth-code', code);
  } catch (err) {
    console.log(err);
  }
  authWindow.close();
});

ipcMain.on('oauthDenied', () => {
  mainWindow.webContents.send('oauth-denied');
  authWindow.close();
});


ipcMain.on('open-oauth-url', (event, url) => {
  authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    'node-integration': false,
  });

  authWindow.loadURL(url);
  authWindow.once('ready-to-show', () => {
    authWindow.show();
  });

  authWindow.webContents.on('did-navigate', (ev, navUrl) => {
    if (navUrl.includes('plugins/servlet/oauth/authorize')) {
      setTimeout(() => {
        if (authWindow) {
          authWindow.webContents.executeJavaScript(`
            var ipcRenderer = require('electron').ipcRenderer;
            var text = document.querySelector('#content p').textContent;
            console.log(text);
            if (text.includes('You have successfully authorized')) {
              ipcRenderer.send('oauthText', text);
            }
            if (text.includes('You have denied')) {
              ipcRenderer.send('oauthDenied', text);
            }
          `);
        }
      }, 500);
    }
  });

  authWindow.on('close', () => {
    authWindow = null;
  }, false);
});


ipcMain.on('showIdlePopup', () => {
  const options = {
    width: 250,
    height: 112,
    frame: false,
  };
  const win = new BrowserWindow(options);
  win.loadURL(`file://${__dirname}/idlePopup.html`);
});


ipcMain.on('set-should-quit', () => {
  shouldQuit = true;
});


ipcMain.on('ready-to-quit', () => {
  shouldQuit = true;
  app.quit();
  tray.destroy();
});

ipcMain.on('minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('maximize', () => {
  if (mainWindow) {
    mainWindow.maximize();
  }
});

ipcMain.on('unmaximize', () => {
  if (mainWindow) {
    mainWindow.unmaximize();
  }
});

ipcMain.on('screenshot-reject', () => {
  mainWindow.webContents.send('screenshot-reject');
});

ipcMain.on('screenshot-accept', () => {
  mainWindow.webContents.send('screenshot-accept');
});

ipcMain.on('errorInWindow', (e, error) => {
  console.log(`${error[0]} @ ${error[1]} ${error[2]}:${error[3]}`);
});

ipcMain.on('dismissIdleTime', (e, time) => {
  mainWindow.webContents.send('dismissIdleTime', time);
});

ipcMain.on('keepIdleTime', () => {
  mainWindow.webContents.send('keepIdleTime');
});

ipcMain.on('dismissAndRestart', (e, time) => {
  mainWindow.webContents.send('dismissAndRestart', time);
});

app.on('before-quit', () => {
  if (process.platform === 'darwin') {
    shouldQuit = true;
  }
});

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.SHOW_DEVTOOLS) {
    await installExtensions();
  }

  tray = new Tray(path.join(__dirname, './assets/images/icon.png'));
  tray.setToolTip('Open chronos tracker');
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
  createWindow(() => {
    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();
  });
});
