/* eslint-disable no-console, global-require */
import path from 'path';
import fs from 'fs';
import keytar from 'keytar';
import storage from 'electron-json-storage';
import {
  app,
  Tray,
  Menu,
  MenuItem,
  ipcMain,
  clipboard,
  BrowserWindow,
  screen,
  session,
  dialog,
} from 'electron';
import config from 'config';
import MenuBuilder from './menu';

import pjson from '../package.json';

const appDir = app.getPath('userData');

let mainWindow;
let issueWindow;
let tray;
let menu;
let shouldQuit = process.platform !== 'darwin';

global.appDir = appDir;
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
};

const menuTemplate = [
  {
    label: 'No selected issue',
    click: () => {
      if (mainWindow) {
        mainWindow.show();
      }
    },
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
    },
  },
];


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === true) {
  // app.commandLine.appendSwitch('allow-insecure-localhost');
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

function getIconByName(name) {
  if (process.env.NODE_ENV === 'development') {
    return path.join(__dirname, `../renderer/assets/images/${name}.png`);
  }
  return path.join(__dirname, `./app/renderer/assets/images/${name}.png`);
}


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
    if (contentSize.length > 1) {
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
    }
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
    let lastWindowSize;
    if (err) {
      lastWindowSize = { width: 1040, height: 800 };
    }
    lastWindowSize = data || {};
    mainWindow = new BrowserWindow({
      show: false,
      width: 1040,
      height: 800,
      minWidth: 1040,
      minHeight: 800,
      ...lastWindowSize,
      ...noFrameOption,
      webPreferences: {
        webSecurity: false,
      },
    });
    if (callback) callback();

    const url = (
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/'
        : `file://${__dirname}/index.html`
    );

    mainWindow.loadURL(url);
    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    mainWindow.on('ready-to-show', () => {
      if (mainWindow) {
        if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === true) {
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
          if (shouldQuit && issueWindow) {
            issueWindow.destroy();
            issueWindow = null;
          }
        }
      }
    });
  });
}

function showScreenPreview() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const options = {
    width: 218,
    height: 240,
    x: width - 218,
    y: height - 212,
    frame: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    show: false,
  };
  const win = new BrowserWindow(options);

  const url = (
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/screenPopup.html'
      : `file://${__dirname}/screenPopup.html`
  );
  win.loadURL(url);
  win.once('ready-to-show', () => {
    win.show();
  });
}

function authJiraBrowserRequests({
  protocol,
  hostname,
  cookies,
}) {
  cookies.forEach((cookie) => {
    session.defaultSession.cookies.set({
      url: `${protocol}://${hostname}`,
      name: cookie.name,
      value: cookie.value,
    }, (error) => {
      if (error) console.log(error);
    });
  });
}

ipcMain.on('remove-auth-cookies', () => {
  session.defaultSession.clearStorageData([], (error) => {
    if (error) console.log(error);
  });
});

ipcMain.on('store-credentials', (event, credentials) => {
  try {
    const {
      name,
      protocol,
      hostname,
      cookies,
    } = credentials;
    const str = JSON.stringify(cookies);
    keytar.setPassword(
      'Chronos',
      name,
      str,
    );
    event.returnValue = true; // eslint-disable-line no-param-reassign
    authJiraBrowserRequests({
      protocol,
      hostname,
      cookies,
    });
  } catch (err) {
    console.log(err);
  }
});

ipcMain.on('get-credentials', (event, { name, protocol, hostname }) => {
  try {
    keytar.getPassword('Chronos', name)
      .then(
        (str) => {
          const cookies = JSON.parse(str);
          const credentials = {
            name,
            cookies,
          };
          event.returnValue = { // eslint-disable-line no-param-reassign
            credentials,
          };
          authJiraBrowserRequests({
            protocol,
            hostname,
            cookies,
          });
        },
      ).catch(
        (err) => {
          event.returnValue = { // eslint-disable-line no-param-reassign
            error: {
              err,
              platform: process.platform,
            },
          };
        },
      );
  } catch (err) {
    event.returnValue = { // eslint-disable-line no-param-reassign
      error: {
        err,
        platform: process.platform,
      },
    };
  }
});

ipcMain.on('start-timer', () => {
  menuTemplate[2].enabled = false;
  menuTemplate[3].enabled = true;

  if (process.platform !== 'darwin') {
    tray.setPressedImage(getIconByName('icon-active'));
  } else {
    tray.setImage(getIconByName('icon-active'));
  }

  menu.clear();
  menuTemplate.forEach((m) => {
    menu.append(new MenuItem(m));
  });
  tray.setContextMenu(menu);
});

ipcMain.on('stop-timer', () => {
  tray.setTitle('');
  menuTemplate[2].enabled = true;
  menuTemplate[3].enabled = false;

  if (process.platform !== 'darwin') {
    tray.setPressedImage(getIconByName('icon'));
  } else {
    tray.setImage(getIconByName('icon'));
  }

  menu.clear();
  menuTemplate.forEach((m) => {
    menu.append(new MenuItem(m));
  });
  tray.setContextMenu(menu);
});

ipcMain.on('select-issue', (event, issueKey) => {
  menuTemplate[0].label = `Selected issue: ${issueKey}`;
  if (menuTemplate[3].enabled !== true) {
    menuTemplate[2].enabled = true;
  }
  menu.clear();
  menuTemplate.forEach((m) => {
    menu.append(new MenuItem(m));
  });
  tray.setContextMenu(menu);
});

ipcMain.on('issue-created', (event, issues) => {
  issues.forEach(({ issueKey }) => {
    mainWindow.webContents.send('newIssue', issueKey);
  });
});

ipcMain.on('issue-refetch', (event, issueId) => {
  mainWindow.webContents.send('reFetchIssue', issueId);
});

ipcMain.on('save-login-debug', (event, messages) => {
  const log = messages.map(message => (message.string
    ? `${message.string}`
    : `${JSON.stringify(message.json, null, 2)}`
  )).join('\n');
  dialog.showSaveDialog(mainWindow, {
    defaultPath: `chronos-${pjson.version}-auth-debug.log`,
  },
  (filename) => {
    if (filename) {
      fs.writeFileSync(filename, log);
    }
  });
});

ipcMain.on('copy-login-debug', (event, messages) => {
  const log = messages.map(message => (message.string
    ? `${message.string}`
    : `${JSON.stringify(message.json, null, 2)}`
  )).join('\n');
  clipboard.writeText(log);
});

ipcMain.on('load-issue-window', (event, url) => {
  if (!issueWindow) {
    issueWindow = new BrowserWindow({
      backgroundColor: 'white',
      parent: mainWindow,
      show: false,
      modal: true,
      useContentSize: true,
      center: true,
      title: 'Chronos',
    });
    const html = (
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/issueForm.html'
        : `file://${__dirname}/issueForm.html`
    );
    issueWindow.loadURL(html);
    issueWindow.webContents.on('did-finish-load', () => {
      issueWindow.webContents.send('url', url);
    });
    if (
      config.issueWindowDevTools
      || process.env.DEBUG_PROD === true
    ) {
      issueWindow.openDevTools();
    }
    issueWindow.on('close', (cEv) => {
      if (!shouldQuit) {
        cEv.preventDefault();
        issueWindow.hide();
      }
    });
    ipcMain.on('page-fully-loaded', () => {
      if (issueWindow) {
        issueWindow.webContents.send('page-fully-loaded');
      }
    });
    ipcMain.on('close-issue-window', () => {
      if (issueWindow) {
        issueWindow.hide();
      }
    });
    ipcMain.on('show-issue-window', (ev, opts) => {
      if (issueWindow) {
        issueWindow.webContents.send('showForm', opts);
        issueWindow.show();
      }
    });
  } else {
    issueWindow.webContents.send('url', url);
  }
});

ipcMain.on('show-idle-popup', () => {
  const options = {
    width: 460,
    height: 150,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
  };
  const win = new BrowserWindow(options);

  const url = (
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/idlePopup.html'
      : `file://${__dirname}/idlePopup.html`
  );
  win.loadURL(url);
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

ipcMain.on('show-screenshot-popup', () => {
  showScreenPreview();
});

ipcMain.on('dismiss-idle-time', (e, time) => {
  if (mainWindow) {
    mainWindow.webContents.send('dismiss-idle-time', time);
  }
});

ipcMain.on('keep-idle-time', () => {
  if (mainWindow) {
    mainWindow.webContents.send('keep-idle-time');
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
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === true) {
    await installExtensions();
  }

  tray = new Tray(getIconByName('icon'));
  global.tray = tray;
  menu = Menu.buildFromTemplate(menuTemplate);
  global.menu = menu;
  tray.setContextMenu(menu);

  createWindow(() => {
    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();
  });
});
