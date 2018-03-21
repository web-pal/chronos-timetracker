// @flow
import {
  call,
  put,
  takeEvery,
  select,
  cps,
  all,
} from 'redux-saga/effects';
import {
  remote,
} from 'electron';
import path from 'path';
import fs from 'fs';

import * as Api from 'api';

import {
  actionTypes,
  uiActions,
  authActions,
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

function* clearElectronCacheSaga(): Generator<*, *, *> {
  try {
    const appDir = remote.getGlobal('appDir');
    yield call(removeDir, appDir);
    yield put(authActions.logoutRequest({ dontForget: true }));
  }
  catch(e) {
    console.log(`@@ Error while removing appDir (${appDir})`, e);
  }
}

export function* watchClearElectronChanheRequest(): Generator<*, *, *> {
  yield takeEvery(actionTypes.CLEAR_ELECTRON_CACHE, clearElectronCacheSaga);
}


function* removeDir(dir) {
  const ex = fs.existsSync(dir);
  const exists = yield cps(fs.lstat, dir);
  if (exists) {
    const files = yield cps(fs.readdir, dir);
    yield all(
      files.map(fileName => call(removeAllIn, dir, fileName)),
    );
    yield cps(fs.rmdir, dir);
    console.log(`Removed dir ${dir}`);
  }
}

function* removeAllIn(dir, pathName) {
  const p = path.join(dir, pathName);
  const stat = yield cps(fs.lstat, p);
  if (stat.isDirectory()) {
    yield call(removeDir, p);
  } else {
    yield cps(fs.unlink, p);
    console.log(`Removed file ${p}`);
  }
}
