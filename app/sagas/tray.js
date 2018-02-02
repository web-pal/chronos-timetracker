// @flow
import {
  take,
  put,
  call,
  fork,
} from 'redux-saga/effects';

import {
  uiActions,
  timerActions,
} from 'actions';

import createIpcChannel from './ipc';


function getTrayChannelListener(channel, type) {
  return function* watchTray() {
    while (true) {
      yield take(channel);
      if (type === 'tray-start-click') {
        yield put(timerActions.startTimer());
      } else if (type === 'tray-stop-click') {
        yield put(timerActions.stopTimerRequest());
      } else if (type === 'tray-settings-click') {
        yield put(uiActions.setModalState('settings', true));
      }
    }
  };
}

export function* createIpcTrayListeners(): Generator<*, *, *> {
  const trayStartChannel = yield call(createIpcChannel, 'tray-start-click');
  const trayStopChannel = yield call(createIpcChannel, 'tray-stop-click');
  const traySettingsChannel = yield call(createIpcChannel, 'tray-settings-click');

  yield fork(getTrayChannelListener(trayStartChannel, 'tray-start-click'));
  yield fork(getTrayChannelListener(trayStopChannel, 'tray-stop-click'));
  yield fork(getTrayChannelListener(traySettingsChannel, 'tray-settings-click'));
}
