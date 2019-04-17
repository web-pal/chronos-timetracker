import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  MenuItem,
  screen,
} from 'electron';
import path from 'path';
import Positioner from 'electron-positioner';

import {
  take,
  race,
  call,
  fork,
  select,
  takeEvery,
} from 'redux-saga/effects';

import {
  actionTypes,
  timerActions,
  uiActions,
} from 'shared/actions';
import {
  windowsManagerSagas,
} from 'shared/sagas';
import {
  browserWindowInstanceEvents,
  webContentsInstanceEvents,
} from 'shared/constants';

import store from '../store';
import MenuBuilder from '../menu';


function* trayManager() {
  function getIconByName(name) {
    if (process.env.NODE_ENV === 'development') {
      return path.join(__dirname, `../../renderer/assets/images/${name}.png`);
    }
    return path.join(__dirname, `./app/renderer/assets/images/${name}.png`);
  }

  const tray = new Tray(getIconByName('icon'));

  const menuTemplate = [
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
        BrowserWindow
          .getAllWindows()
          .filter(win => win.id === 1)
          .forEach(win => win.show());
        store.dispatch(timerActions.startTimer());
      },
      enabled: false,
    },
    {
      label: 'Stop',
      click: () => {
        BrowserWindow
          .getAllWindows()
          .filter(win => win.id === 1)
          .forEach(win => win.show());
        store.dispatch(timerActions.stopTimerRequest());
      },
      enabled: false,
    },
    {
      type: 'separator',
    },
    {
      label: 'Settings',
      click: () => {
        BrowserWindow
          .getAllWindows()
          .filter(win => win.id === 1)
          .forEach(win => win.show());
        store.dispatch(uiActions.setModalState('settings', true));
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ];
  const contextMenu = Menu.buildFromTemplate(menuTemplate);
  tray.setToolTip('Chronos');
  tray.setContextMenu(contextMenu);
  global.tray = tray;

  while (true) {
    const {
      startTimer,
      stopTimer,
      selectIssue,
    } = yield race({
      startTimer: take(actionTypes.TRAY_START_TIMER),
      stopTimer: take(actionTypes.TRAY_STOP_TIMER),
      selectIssue: take(actionTypes.TRAY_SELECT_ISSUE),
    });
    if (startTimer) {
      menuTemplate[2].enabled = false;
      menuTemplate[3].enabled = true;

      if (process.platform !== 'darwin') {
        tray.setPressedImage(getIconByName('icon-active'));
      } else {
        tray.setImage(getIconByName('icon-active'));
      }

      contextMenu.clear();
      menuTemplate.forEach((m) => {
        contextMenu.append(new MenuItem(m));
      });
      tray.setContextMenu(contextMenu);
    }

    if (stopTimer) {
      tray.setTitle('');
      menuTemplate[2].enabled = true;
      menuTemplate[3].enabled = false;

      if (process.platform !== 'darwin') {
        tray.setPressedImage(getIconByName('icon'));
      } else {
        tray.setImage(getIconByName('icon'));
      }

      contextMenu.clear();
      menuTemplate.forEach((m) => {
        contextMenu.append(new MenuItem(m));
      });
      tray.setContextMenu(contextMenu);
    }

    if (selectIssue) {
      menuTemplate[0].label = `Selected issue: ${selectIssue.issueKey}`;
      if (menuTemplate[3].enabled !== true) {
        menuTemplate[2].enabled = true;
      }
      contextMenu.clear();
      menuTemplate.forEach((m) => {
        contextMenu.append(new MenuItem(m));
      });
      tray.setContextMenu(contextMenu);
    }
  }
}

function* teamStatusListTrayManager() {
  function getIconByName(name) {
    if (process.env.NODE_ENV === 'development') {
      return path.join(__dirname, `../../renderer/assets/images/${name}.png`);
    }
    return path.join(__dirname, `./app/renderer/assets/images/${name}.png`);
  }

  const tray = new Tray(getIconByName('icon'));
  tray.setToolTip('Chronos Team Status');
  global.teamStatusListTray = tray;
}

function* onClose({
  win,
  channel,
}) {
  while (true) {
    const { data } = yield take(channel);
    const { willQuitApp } = yield select(state => state.windowsManager);
    if (
      !willQuitApp
      && process.platform === 'darwin'
    ) {
      data.preventDefault();
      win.hide();
    }
  }
}

const getWindowPosition = (window) => {
  const windowPositioner = new Positioner(window);
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  const windowSize = window.getBounds();
  const trayBounds = global.teamStatusListTray.getBounds();

  const windowLength = (trayBounds.x + (trayBounds.width / 2)) + windowSize.width;
  const windowOutOfBounds = (windowLength > screenSize.width);

  let trayPosition = null;
  let windowPosition = null;
  let positionToSet = null;

  const halfScreenWidth = screenSize.width / 2;
  const halfScreenHeight = screenSize.height / 2;

  if (process.platform === 'win32') {
    // Vertical or Horizontal Taskbar

    if ((trayBounds.x + trayBounds.width) <= halfScreenWidth) {
      // left
      trayPosition = 'trayBottomLeft';
      windowPosition = windowPositioner.calculate(trayPosition, trayBounds);
      positionToSet = { x: windowPosition.x + 78, y: windowPosition.y - 10 };
    } else if ((trayBounds.x + trayBounds.width) >= halfScreenWidth) {
      if ((trayBounds.y + trayBounds.height) <= halfScreenHeight) {
        // top
        trayPosition = 'trayCenter';
        windowPosition = windowPositioner.calculate(trayPosition, trayBounds);
        positionToSet = { x: windowPosition.x, y: windowPosition.y + 8 };
      } else if ((trayBounds.y + trayBounds.height) >= halfScreenHeight) {
        // bottom or right
        trayPosition = 'trayBottomCenter';
        windowPosition = windowPositioner.calculate(trayPosition, trayBounds);
        positionToSet = { x: windowPosition.x, y: windowPosition.y - 6 };
      }
    }

    // Account for the window potentially getting clipped if it's too far right
    if (windowOutOfBounds) {
      positionToSet = { x: positionToSet.x - 7, y: positionToSet.y };
    }
  } else if (process.platform === 'darwin') {
    // top
    trayPosition = 'trayCenter';
    windowPosition = windowPositioner.calculate(trayPosition, trayBounds);
    positionToSet = { x: windowPosition.x, y: windowPosition.y + 3 };

    // Account for the window potentially getting clipped if it's too far right
    if (windowOutOfBounds) {
      positionToSet = { x: positionToSet.x - 20, y: positionToSet.y };
    }
  } else {
    trayPosition = 'topRight';
    windowPosition = windowPositioner.calculate(trayPosition, trayBounds);
    positionToSet = { x: windowPosition.x - 10, y: windowPosition.y + 5 };
  }

  return positionToSet;
};

const showWindow = (window) => {
  const position = getWindowPosition(window);
  window.setPosition(position.x, position.y, !!process.platform === 'darwin');
  window.show();
  window.focus();
};

function* onToggleClick({
  win,
  channel,
}) {
  while (true) {
    yield take(channel);
    if (win.isVisible()) {
      global.teamStatusListTray.setHighlightMode('never');
      win.hide();
    } else {
      global.teamStatusListTray.setHighlightMode('always');
      yield call(showWindow, win);
    }
  }
}

function* onBlur({
  win,
  channel,
}) {
  while (true) {
    yield take(channel);
    global.teamStatusListTray.setHighlightMode('never');
    win.hide();
  }
}

function* forkInitialRendererProcess() {
  try {
    yield fork(trayManager);
    yield fork(teamStatusListTrayManager);
    const url = (
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : `file://${__dirname}/index.html`
    );
    const teamStatusListUrl = (
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/teamStatusList.html'
        : `file://${__dirname}../teamStatusList.html`
    );
    const noFrameOptions = {};
    switch (process.platform) {
      case 'darwin':
        noFrameOptions.titleBarStyle = 'hidden';
        break;
      case 'linux':
      case 'windows':
        noFrameOptions.frame = true;
        break;
      default:
        break;
    }
    const win = yield call(
      windowsManagerSagas.forkNewWindow,
      {
        url,
        showOnReady: true,
        scopes: ['mainRenderer'],
        BrowserWindow,
        options: {
          show: false,
          width: 1040,
          height: 800,
          minWidth: 1040,
          minHeight: 600,
          webPreferences: {
            devTools: (
              process.env.NODE_ENV === 'development'
              || process.env.DEBUG_PROD === 'true'
            ),
            webSecurity: false,
          },
          ...noFrameOptions,
        },
      },
    );
    const teamStatusListWindow = yield call(
      windowsManagerSagas.forkNewWindow,
      {
        url: teamStatusListUrl,
        showOnReady: true,
        scopes: ['mainRenderer'],
        BrowserWindow,
        options: {
          show: false,
          width: 320,
          height: 350,
          minWidth: 320,
          minHeight: 350,
          fullscreenable: false,
          resizable: false,
          transparent: true,
          skipTaskbar: true,
          alwaysOnTop: true,
          frame: false,
          webPreferences: {
            devTools: (
              process.env.NODE_ENV === 'development'
              || process.env.DEBUG_PROD === 'true'
            ),
            webSecurity: false,
            backgroundThrottling: false,
          },
        },
      },
    );

    const position = getWindowPosition(teamStatusListWindow);
    teamStatusListWindow.setPosition(position.x, position.y, false);

    const menuBuilder = new MenuBuilder(win);
    menuBuilder.buildMenu();

    const closeChannel = windowsManagerSagas.createWindowChannel({
      win,
      events: [
        'close',
      ],
    });

    const teamStatusListCloseChannel = windowsManagerSagas.createWindowChannel({
      win: teamStatusListWindow,
      events: [
        'close',
      ],
    });

    const teamStatusListToggleChannel = windowsManagerSagas.createWindowChannel({
      win: global.teamStatusListTray,
      events: [
        'click',
      ],
    });

    const blurChannel = windowsManagerSagas.createWindowChannel({
      win: teamStatusListWindow,
      events: [
        'blur',
      ],
    });

    yield fork(onToggleClick, {
      win: teamStatusListWindow,
      channel: teamStatusListToggleChannel,
    });

    yield fork(onBlur, {
      win: teamStatusListWindow,
      channel: blurChannel,
    });

    yield fork(onClose, {
      win,
      channel: closeChannel,
    });

    yield fork(onClose, {
      win: teamStatusListWindow,
      channel: teamStatusListCloseChannel,
    });

    const eventsChannel = windowsManagerSagas.createWindowChannel({
      win,
      events: browserWindowInstanceEvents,
      webContentsEvents: webContentsInstanceEvents,
    });

    const teamStatusListEventsChannel = windowsManagerSagas.createWindowChannel({
      win: teamStatusListWindow,
      events: browserWindowInstanceEvents,
      webContentsEvents: webContentsInstanceEvents,
    });

    yield fork(windowsManagerSagas.onEventLogger, {
      windowId: win.id,
      channel: eventsChannel,
      scope: 'all',
    });

    yield fork(windowsManagerSagas.onEventLogger, {
      windowId: teamStatusListWindow.id,
      channel: teamStatusListEventsChannel,
      scope: 'all',
    });
  } catch (err) {
    console.log(err);
  }
}

export function* initialize() {
  yield takeEvery(actionTypes.INITIAL, forkInitialRendererProcess);
}
