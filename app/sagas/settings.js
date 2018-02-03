// @flow
import {
  call,
  put,
  takeEvery,
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
  getSettingsState,
} from 'selectors';

import {
  infoLog,
  throwError,
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
    yield call(throwError, err);
  }
}

export function* onChangeLocalDesktopSettings({
  settingName,
  value,
}: {
  settingName: string,
  value: any,
}): Generator<*, *, *> {
  try {
    yield call(
      infoLog,
      'set local desktop setting request',
      {
        value,
        settingName,
      },
    );
    if (settingName === 'trayShowTimer' && !value) {
      remote.getGlobal('tray').setTitle('');
    }
    if (settingName === 'updateChannel') {
      yield call(
        infoLog,
        `switched updateChannel to ${value}, checking for updates...`,
      );
      yield put(uiActions.checkForUpdatesRequest());
    }
    const newLocalSettings = yield select(getSettingsState('localDesktopSettings'));
    yield call(
      setToStorage,
      'localDesktopSettings',
      {
        ...newLocalSettings,
        [settingName]: value,
      },
    );
  } catch (err) {
    yield call(throwError, err);
  }
}

export function* watchLocalDesktopSettingsChange(): Generator<*, *, *> {
  yield takeEvery(actionTypes.SET_LOCAL_DESKTOP_SETTING, onChangeLocalDesktopSettings);
}
