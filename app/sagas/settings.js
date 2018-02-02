// @flow
import {
  call,
  take,
  put,
  select,
} from 'redux-saga/effects';
import {
  remote,
} from 'electron';

import * as Api from 'api';

import {
  actionTypes,
  uiActions,
} from 'actions';
import {
  getLocalDesktopSettings,
} from 'selectors';

import {
  infoLog,
} from './ui';
import {
  setToStorage,
} from './storage';


export function* getSettings(): Generator<*, *, *> {
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
    // yield put(settingsActions.fillSettings(payload));
  } catch (err) {
    console.log(err);
  }
}

export function* watchLocalDesktopSettingsChange(): Generator<*, *, *> {
  while (true) {
    const { payload, meta } = yield take(actionTypes.SET_LOCAL_DESKTOP_SETTING);
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
