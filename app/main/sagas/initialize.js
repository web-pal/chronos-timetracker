import {
  BrowserWindow,
} from 'electron';

import {
  take,
  call,
  fork,
  select,
  takeEvery,
} from 'redux-saga/effects';

import {
  actionTypes,
} from 'shared/actions';
import {
  windowsManagerSagas,
} from 'shared/sagas';
import {
  browserWindowInstanceEvents,
  webContentsInstanceEvents,
} from 'shared/constants';

import MenuBuilder from '../menu';


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
    const url = (
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
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
