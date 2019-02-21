import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  MenuItem,
} from 'electron';
import path from 'path';

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
        store.dispatch(timerActions.startTimer());
      },
      enabled: false,
    },
    {
      label: 'Stop',
      click: () => {
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

function* onClose({
  win,
  channel,
}) {
  while (true) {
    const { data } = yield take(channel);
    const { willQuitApp } = yield select(state => state.windowsManager);
    if (!willQuitApp && process.platform === 'darwin') {
      data.preventDefault();
      win.hide();
    }
  }
}

function* forkInitialRendererProcess() {
  try {
    yield fork(trayManager);
    const url = (
      process.env.NODE_ENV === 'development'
        // ? 'http://localhost:3000'
        ? 'http://localhost:3000/trelloIndex.html'
        : `file://${__dirname}/index.html`
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
          minHeight: 800,
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

    const menuBuilder = new MenuBuilder(win);
    menuBuilder.buildMenu();

    const closeChannel = windowsManagerSagas.createWindowChannel({
      win,
      events: [
        'close',
      ],
    });

    yield fork(onClose, {
      win,
      channel: closeChannel,
    });

    const eventsChannel = windowsManagerSagas.createWindowChannel({
      win,
      events: browserWindowInstanceEvents,
      webContentsEvents: webContentsInstanceEvents,
    });
    yield fork(windowsManagerSagas.onEventLogger, {
      windowId: win.id,
      channel: eventsChannel,
      scope: 'all',
    });
  } catch (err) {
    console.log(err);
  }
}

export function* initialize() {
  yield takeEvery(actionTypes.INITIAL, forkInitialRendererProcess);
}
