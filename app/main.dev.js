/* eslint-disable no-console, global-require */
import path from 'path';
import keytar from 'keytar';
import storage from 'electron-json-storage';
import {
  app,
  Tray,
  Menu,
  MenuItem,
  ipcMain,
  BrowserWindow,
  screen,
  session,
} from 'electron';
import notifier from 'node-notifier';
import fs from 'fs';
import MenuBuilder from './menu';

const appDir = app.getPath('userData');

let mainWindow;
let tray;
let menu;
let authWindow;
let authJiraBrowserRequestsCallbackIsSet = false;
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
      tray.destroy();
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
    });
    callback();

    mainWindow.loadURL(`file://${__dirname}/app.html`);
    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    mainWindow.on('ready-to-show', () => {
      if (mainWindow) {
        if (process.NODE_ENV === 'development' || process.env.DEBUG_PROD === true) {
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
  win.loadURL(`file://${__dirname}/screenPopup.html`);
  win.once('ready-to-show', () => {
    win.show();
  });
}

function authJiraBrowserRequests({
  username,
  password,
  host,
}) {
  // Just in case
  if (!authJiraBrowserRequestsCallbackIsSet) {
    authJiraBrowserRequestsCallbackIsSet = true;
    const filter = {
      urls: [
        '*://atlassian.net/*',
        '*://atlassian.com/*',
        '*://atlassian.io/*',
        '*://cloudfront.net/*',
        `*://${host}/*`,
      ],
    };
    // Basic auth for jira links(media in renderedFields)
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
      details.requestHeaders['Authorization'] = // eslint-disable-line
        `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
      callback({
        cancel: false,
        requestHeaders: details.requestHeaders,
      });
    });
  }
}

ipcMain.on('store-credentials', (event, credentials) => {
  const { username, password, host } = credentials;
  keytar.setPassword('Chronos', username, password);
  event.returnValue = true; // eslint-disable-line no-param-reassign
  authJiraBrowserRequests({
    username,
    password,
    host,
  });
});

ipcMain.on('get-credentials', (event, { username, host }) => {
  keytar.getPassword('Chronos', username)
    .then(
      (password) => {
        const credentials = {
          username,
          password,
        };
        event.returnValue = credentials; // eslint-disable-line no-param-reassign
        authJiraBrowserRequests({
          username,
          password,
          host,
        });
      },
    );
});

ipcMain.on('start-timer', () => {
  menuTemplate[2].enabled = false;
  menuTemplate[3].enabled = true;

  if (process.platform !== 'darwin') {
    tray.setPressedImage(path.join(__dirname, './assets/images/icon-active.png'));
  } else {
    tray.setImage(path.join(__dirname, './assets/images/icon-active.png'));
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
    tray.setPressedImage(path.join(__dirname, './assets/images/icon.png'));
  } else {
    tray.setImage(path.join(__dirname, './assets/images/icon.png'));
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

ipcMain.on('open-create-issue-window', (event, url) => {
  let createIssueWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    useContentSize: true,
    closable: true,
    center: true,
    title: 'Chronos',
    webPreferences: {
      nodeIntegration: false,
      devTools: true,
    },
  });
  createIssueWindow.loadURL(url);
  createIssueWindow.once('ready-to-show', () => {
    if (createIssueWindow) {
      createIssueWindow.show();
    }
  });

  createIssueWindow.webContents.on('dom-ready', () => {
    createIssueWindow.webContents.executeJavaScript(`
      var sidebar = document.getElementById('navigation-app');
      var cancel = document.getElementById('issue-create-cancel');
      if (sidebar) {
        sidebar.parentNode.removeChild(sidebar);
      }
      if (cancel) {
        cancel.addEventListener('click', function (event) {
          window.close();
        });
      }
    `);
  });
  createIssueWindow.webContents.on('did-get-redirect-request', (ev, fromUrl, newUrl) => {
    if (fromUrl.includes('CreateIssueDetails.jspa')) {
      const issueKey = newUrl.split('/').pop();
      mainWindow.webContents.send('newIssue', issueKey);
      createIssueWindow.close();
    }
  });
  createIssueWindow.on('close', () => {
    createIssueWindow = null;
  }, false);
});

ipcMain.on('oauth-response', (event, text) => {
  if (mainWindow && authWindow) {
    try {
      const code = text.split('.')[1].split('\'')[1];
      mainWindow.webContents.send('oauth-accepted', code);
    } catch (err) {
      console.log(err);
    }
    authWindow.close();
  }
});

ipcMain.on('oauth-denied', () => {
  if (mainWindow && authWindow) {
    mainWindow.webContents.send('oauth-denied');
    authWindow.close();
  }
});

ipcMain.on('open-oauth-url', (event, url) => {
  authWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    useContentSize: true,
    closable: true,
    resizable: false,
    center: true,
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
            if (text.includes('You have successfully authorized')) {
              ipcRenderer.send('oauth-response', text);
            }
            if (text.includes('You have denied')) {
              ipcRenderer.send('oauth-denied', text);
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


ipcMain.on('show-idle-popup', () => {
  const options = {
    width: 460,
    height: 130,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
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

ipcMain.on('show-screenshot-popup', () => {
  let nativeNotifications = process.platform === 'darwin';
  if (process.platform === 'darwin' && mainWindow) {
    nativeNotifications = global.sharedObj.nativeNotifications; // eslint-disable-line
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

  try {
    fs.accessSync(`${appDir}/screens/`, fs.constants.R_OK | fs.constants.W_OK); // eslint-disable-line
  } catch (err) {
    fs.mkdirSync(`${appDir}/screens/`);
  }
  try {
    fs.accessSync(`${appDir}/offline_screens/`, fs.constants.R_OK | fs.constants.W_OK); // eslint-disable-line
  } catch (err) {
    fs.mkdirSync(`${appDir}/offline_screens/`);
  }
  try {
    fs.accessSync(`${appDir}/current_screenshots/`, fs.constants.R_OK | fs.constants.W_OK); // eslint-disable-line
  } catch (err) {
    fs.mkdirSync(`${appDir}/current_screenshots/`);
  }
  try {
    fs.accessSync(`${appDir}/worklogs/`, fs.constants.R_OK | fs.constants.W_OK) // eslint-disable-line
  } catch (err) {
    fs.mkdirSync(`${appDir}/worklogs/`);
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
