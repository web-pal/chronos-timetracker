/* eslint-disable no-console */
import { app, Tray, BrowserWindow, ipcMain, Menu } from 'electron';
import log from 'electron-log';
import path from 'path';

global.appDir = __dirname;
global.sharedObj = {
  lastScreenshotPath: '',
  screenshotTime: null,
  currentWorklogId: null,
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

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') app.quit();
});

let menu;
let mainWindow;
let template;

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
}

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require
    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS',
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload);
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

let tray = null;

app.on('ready', async () => {
  await installExtensions();
  tray = new Tray(path.join(__dirname, './assets/images/clock.png'));
  tray.setToolTip('Open chronos tracker');
  tray.on('click', () => mainWindow.show());
  createWindow();
  if (process.platform === 'darwin') {
    template = [{
      label: 'Chronos',
      submenu: [{
        label: 'About Chronos',
        selector: 'orderFrontStandardAboutPanel:',
      }, {
        type: 'separator',
      }, {
        label: 'Hide DBGlass',
        accelerator: 'Command+H',
        selector: 'hide:',
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:',
      }, {
        label: 'Show All',
        selector: 'unhideAllApplications:',
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
  }
});

