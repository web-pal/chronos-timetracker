/* eslint-disable no-console */
/* global sharedObj */
import { app, Tray, BrowserWindow, ipcMain, Menu, screen } from 'electron';
import log from 'electron-log';
import path from 'path';
import updater from 'electron-simple-updater';
import storage from 'electron-json-storage';

updater.init({
  logger: log,
  checkUpdateOnStart: false,
  autoDownload: false,
});

global.appDir = app.getPath('userData');
global.appSrcDir = __dirname;
global.sharedObj = {
  running: false,
  uploading: false,
  lastScreenshotPath: '',
  screenshotTime: null,
  idleTime: 0,
};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line
}

process.on('uncaughtExecption', (err) => {
  console.error('Uncaught exception in main process', err);
});


let menu;
let mainWindow;
let authWindow;
let template;
let shouldQuit = process.platform !== 'darwin';
let tray = null;

app.on('window-all-closed', () => {
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


function createWindow() {
  // disabling chrome frames differ on OSX and other platforms
  // https://github.com/electron/electron/blob/master/docs/api/frameless-window.md
  const noFrameOption = process.platform === 'darwin'
    ? { titleBarStyle: 'hidden' }
    : { frame: false };

  storage.get('lastWindowSize', (err, data) => {
    if (err) {
      console.log(err);
    }
    const lastWindowSize = data || {};
    mainWindow = new BrowserWindow({
      show: false,
      width: lastWindowSize.width || 810,
      height: lastWindowSize.height || 575,
      minWidth: 710,
      minHeight: 400,
      ...noFrameOption,
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);
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

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require
    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS',
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) { // eslint-disable-line
      try {
        await installer.default(installer[name], forceDownload); // eslint-disable-line
      } catch (e) {} // eslint-disable-line
    }
  }
};

ipcMain.on('screenshot-reject', () => {
  mainWindow.webContents.send('screenshot-reject');
});

ipcMain.on('screenshot-accept', () => {
  mainWindow.webContents.send('screenshot-accept');
});

ipcMain.on('errorInWindow', (e, error) => {
  log.error(`${error[0]} @ ${error[1]} ${error[2]}:${error[3]}`);
});

ipcMain.on('dismissIdleTime', (e, time) => {
  mainWindow.webContents.send('dismissIdleTime', time);
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
  await installExtensions();
  tray = new Tray(path.join(__dirname, './assets/images/icon.png'));
  tray.setToolTip('Open chronos tracker');
  tray.on('click', () => mainWindow.show());
  createWindow();
  if (process.platform === 'darwin') {
    template = [{
      label: 'Chronos',
      submenu: [{
        label: 'About Chronos',
        role: 'about',
      }, {
        type: 'separator',
      }, {
        label: 'Hide Chronos',
        accelerator: 'Command+H',
        role: 'hide',
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        role: 'hideothers',
      }, {
        label: 'Show All',
        role: 'unhide',
      }, {
        type: 'separator',
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        },
      }],
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:',
      }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:',
      }, {
        type: 'separator',
      }, {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:',
      }, {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:',
      }, {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:',
      }, {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:',
      }],
    }, {
      label: 'View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: 'Reload',
        accelerator: 'Command+R',
        click() {
          mainWindow.webContents.send('reload');
        },
      }, {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click() {
          mainWindow.toggleDevTools();
        },
      }] : [{
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      }],
    }, {
      label: 'Window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:',
      }, {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:',
      }, {
        type: 'separator',
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:',
      }],
    }];
    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
