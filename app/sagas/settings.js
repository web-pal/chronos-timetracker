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
} from 'actions';
import {
  getSettingsState,
} from 'selectors';

import {
  infoLog,
  throwError,
} from './ui';
import {
  getFromStorage,
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

    if (settingName === 'updateAutomatically') {
      yield call(
        infoLog,
        `switched updateAutomatically to ${value}`,
      );

      const settings = yield call(getFromStorage, 'localDesktopSettings');
      settings.updateAutomatically = value;
      yield call(
        setToStorage,
        'localDesktopSettings',
        settings,
      );

      if (value) {
        yield put(uiActions.checkForUpdatesRequest());
      }
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

function* removeAllIn(dir, pathName) {
  const p = path.join(dir, pathName);
  const stat = yield cps(fs.lstat, p);
  if (stat.isDirectory()) {
    yield call(removeDir, p); // eslint-disable-line
  } else {
    yield cps(fs.unlink, p);
    console.log(`Removed file ${p}`);
  }
}

function* removeDir(dir) {
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

function* clearElectronCacheSaga(): Generator<*, *, *> {
  try {
    const appDir = remote.getGlobal('appDir');
    yield call(removeDir, appDir);
    remote.app.relaunch();
    remote.app.exit(0);
  } catch (err) {
    console.log('@@ Error while removing appDir', err);
  }
}

export function* watchClearElectronChanheRequest(): Generator<*, *, *> {
  yield takeEvery(actionTypes.CLEAR_ELECTRON_CACHE, clearElectronCacheSaga);
}
