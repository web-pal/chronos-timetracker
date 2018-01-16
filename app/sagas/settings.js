import {
  call,
  take,
  put,
  select,
} from 'redux-saga/effects';
import * as Api from 'api';
import { remote } from 'electron';
import Raven from 'raven-js';
import { types, settingsActions, uiActions } from 'actions';
import { getLocalDesktopSettings } from 'selectors';
import { infoLog } from './ui';

import {
  setToStorage,
} from './storage';


export function* getSettings() {
  try {
    yield call(
      infoLog,
      'backend settings requested',
    );
    const { payload } = yield call(Api.fetchSettings);
    yield call(
      infoLog,
      'got backend settings',
      payload,
    );
    yield put(settingsActions.fillSettings(payload));
  } catch (err) {
    Raven.captureException(err);
  }
}

export function* watchLocalDesktopSettingsChange() {
  while (true) {
    const { payload, meta } = yield take(types.SET_LOCAL_DESKTOP_SETTING);
    yield call(
      infoLog,
      'set local desktop setting request',
      {
        key: meta,
        payload,
      },
    );
    if (meta === 'trayShowTimer' && !payload) {
      remote.getGlobal('tray').setTitle('');
    }
    if (meta === 'updateChannel') {
      yield call(
        infoLog,
        `switched updateChannel to ${payload}, checking for updates...`,
      );
      yield put(uiActions.checkForUpdatesRequest());
    }
    const newLocalSettings = yield select(getLocalDesktopSettings);
    newLocalSettings[meta] = payload;
    yield call(
      infoLog,
      'new local desktop settings = ',
      newLocalSettings,
    );
    yield call(setToStorage, 'localDesktopSettings', newLocalSettings);
  }
}
