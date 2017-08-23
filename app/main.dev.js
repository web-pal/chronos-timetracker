/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
/* global sharedObj */
import path from 'path';
import storage from 'electron-json-storage';
import { app, Tray, Menu, MenuItem, ipcMain, BrowserWindow, screen } from 'electron';
import notifier from 'node-notifier';
import MenuBuilder from './menu';


let mainWindow;
let tray;
let menu;
let authWindow;
let shouldQuit = process.platform !== 'darwin';

global.appDir = app.getPath('userData');
global.appSrcDir = __dirname;
global.sharedObj = {
  running: false,
  uploading: false,
  lastScreenshotPath: '',
  lastScreenshotThumbPath: '',
  screenshotTime: null,
  timestamp: null,
  screenshotPreviewTime: 15,
  nativeNotifications: false,
  idleTime: 0,
  idleDetails: {},
  trayShowTimer: storage.get('trayShowTimer', (err, data) => {
    if (!data) {
      storage.set('trayShowTimer', true);
    }
  }) || true,
};

const menuTemplate = [
  {
    label: 'Logged today: 00:00',
    enabled: false,
  },
  {
    label: 'No selected issue',
    enabled: false,
  },
  {
    type: 'separator',
  },
  {
    label: 'Start',
    click: () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.webContents.send('tray-start-click');
      }
    },
    enabled: false,
  },
  {
    label: 'Stop',
    click: () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.webContents.send('tray-stop-click');
      }
    },
    enabled: false,
  },
  {
    type: 'separator',
  },
  {
    label: 'Settings',
    click: () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.webContents.send('tray-settings-click');
      }
    },
  },
  {
    label: 'Quit',
    click: () => {
      app.quit();
      tray.destroy();
    },
  },
];


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  app.commandLine.appendSwitch('allow-insecure-localhost');
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
    'REDUX_DEVTOOLS',
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
  if (mainWindow) {
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
    if (global.sharedObj.running || global.sharedObj.uploading) {
      console.log('RUNNING');
      mainWindow.webContents.send('force-save');
      e.preventDefault();
      shouldQuit = false;
    }
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
      width: 560,
      height: 675,
      minWidth: 560,
      minHeight: 640,
      ...lastWindowSize,
      ...noFrameOption,
    });
    callback();

    mainWindow.loadURL(`file://${__dirname}/app.html`);
    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    mainWindow.on('ready-to-show', () => {
      if (mainWindow) {
        if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
          mainWindow.webContents.openDevTools();
        }
        mainWindow.show();
        mainWindow.focus();
      }
    });

    mainWindow.on('close', (e) => {
      if (mainWindow) {
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
      }
    });
  });
}

function showScreenPreview() {
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
}

ipcMain.on('startTimer', () => {
  menu.items[3].enabled = false;
  menu.items[4].enabled = true;

  if (process.platform !== 'darwin') {
    tray.setPressedImage(path.join(__dirname, './assets/images/icon-active.png'));
  } else {
    tray.setImage(path.join(__dirname, './assets/images/icon-active.png'));
  }
});

ipcMain.on('stopTimer', () => {
  tray.setTitle('');
  menu.items[3].enabled = true;
  menu.items[4].enabled = false;

  if (process.platform !== 'darwin') {
    tray.setPressedImage(path.join(__dirname, './assets/images/icon.png'));
  } else {
    tray.setImage(path.join(__dirname, './assets/images/icon.png'));
  }
});

ipcMain.on('selectTask', (event, selectedIssue) => {
  menuTemplate[1].label = `Selected issue: ${selectedIssue}`;
  menuTemplate[3].enabled = true;
  menu.clear();
  menuTemplate.forEach(m => {
    menu.append(new MenuItem(m));
  });
  tray.setContextMenu(menu);
});

ipcMain.on('setLoggedToday', (event, logged) => {
  menuTemplate[0].label = `Logged today: ${logged}`;
  menu.clear();
  menuTemplate.forEach(m => {
    menu.append(new MenuItem(m));
  });
  tray.setContextMenu(menu);
});


ipcMain.on('showScreenPreviewPopup', () => {
  let nativeNotifications = process.platform === 'darwin';
  if (process.platform === 'darwin' && mainWindow) {
    nativeNotifications = global.sharedObj.nativeNotifications;
  }
  if (nativeNotifications) {
    const nc = new notifier.NotificationCenter();
    nc.notify(
      {
        title: 'Screenshot preview',
        message: 'Accept or Reject this screenshot',
        contentImage: global.sharedObj.lastScreenshotPath,
        sound: 'Glass',
        closeLabel: 'Accept',
        actions: ['Reject', 'Show preview'],
        dropdownLabel: 'Additional',
        wait: false,
        timeout: global.sharedObj.screenshotPreviewTime,
      },
      (err, response, metadata) => {
        if (response === 'closed') {
          acceptScreenshot();
        }
        if (response === 'activate') {
          if (metadata.activationValue === 'Reject') {
            rejectScreenshot();
          }
          if (metadata.activationValue === 'Show preview') {
            showScreenPreview();
          }
        }
      },
    );
    nc.on('timeout', acceptScreenshot);
  } else {
    showScreenPreview();
  }
});

ipcMain.on('oauthText', (event, text) => {
  if (mainWindow && authWindow) {
    try {
      const code = text.split('.')[1].split('\'')[1];
      mainWindow.webContents.send('oauth-code', code);
    } catch (err) {
      console.log(err);
    }
    authWindow.close();
  }
});

ipcMain.on('oauthDenied', () => {
  if (mainWindow && authWindow) {
    mainWindow.webContents.send('oauth-denied');
    authWindow.close();
  }
});


ipcMain.on('open-oauth-url', (event, url) => {
  authWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  authWindow.loadURL(url);
  authWindow.once('ready-to-show', () => {
    if (authWindow) {
      authWindow.show();
    }
  });

  authWindow.webContents.on('did-navigate', (ev, navUrl) => {
    if (navUrl.includes('plugins/servlet/oauth/authorize')) {
      setTimeout(() => {
        if (authWindow) {
          authWindow.webContents.executeJavaScript(`
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

function rejectScreenshot() {
  if (mainWindow) {
    mainWindow.webContents.send('screenshot-reject');
  }
}
ipcMain.on('screenshot-reject', rejectScreenshot);

function acceptScreenshot() {
  if (mainWindow) {
    mainWindow.webContents.send('screenshot-accept');
  }
}
ipcMain.on('screenshot-accept', acceptScreenshot);

ipcMain.on('errorInWindow', (e, error) => {
  console.log(`${error[0]} @ ${error[1]} ${error[2]}:${error[3]}`);
});

ipcMain.on('dismissIdleTime', (e, time) => {
  if (mainWindow) {
    mainWindow.webContents.send('dismissIdleTime', time);
  }
});

ipcMain.on('keepIdleTime', () => {
  if (mainWindow) {
    mainWindow.webContents.send('keepIdleTime');
  }
});

ipcMain.on('dismissAndRestart', (e, time) => {
  if (mainWindow) {
    mainWindow.webContents.send('dismissAndRestart', time);
  }
});

app.on('before-quit', () => {
  if (process.platform === 'darwin') {
    shouldQuit = true;
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  tray = new Tray(path.join(__dirname, '/assets/images/icon.png'));
  global.tray = tray;
  menu = Menu.buildFromTemplate(menuTemplate);
  global.menu = menu;
  tray.setContextMenu(menu);

  createWindow(() => {
    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();
  });
});
