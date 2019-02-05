// @flow
import {
  call,
  select,
  put,
  takeEvery,
  cps,
  all,
} from 'redux-saga/effects';
import {
  remote,
} from 'electron';
import path from 'path';
import fs from 'fs';

import {
  actionTypes,
  uiActions,
} from 'actions';

import {
  infoLog,
  throwError,
} from './ui';
import {
  setElectronStorage,
} from './helpers';


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

const keytar = remote.require('keytar');
function* clearElectronCacheSaga(): Generator<*, *, *> {
  try {
    yield call(
      remote.session.defaultSession.clearStorageData,
      {
        quotas: [
          'temporary',
          'persistent',
          'syncable',
        ],
        storages: [
          'appcache',
          'cookies',
          'filesystem',
          'indexdb',
          'localstorage',
          'shadercache',
          'websql',
          'serviceworkers',
          'cachestorage',
        ],
      },
    );
    const accounts = yield call(
      keytar.findCredentials,
      'Chronos',
    );
    yield all(
      accounts.map(
        ({ account }) => (
          call(
            keytar.deletePassword,
            'Chronos',
            account,
          )
        ),
      ),
    );

    const hostname = yield select(
      uiActions.getUiState2('hostname'),
    );
    yield call(
      setElectronStorage,
      `persistUiState_${hostname}`,
      {},
    );
    yield call(
      setElectronStorage,
      'accounts',
      [],
    );
    yield call(
      setElectronStorage,
      `localDesktopSettings_${hostname}`,
      {},
    );
    /*
    const appDir = remote.getGlobal('appDir');
    yield call(removeDir, appDir);
    remote.app.relaunch();
    remote.app.exit(0);
    */
  } catch (err) {
    console.log('@@ Error while removing appDir', err);
  }
}

export function* watchClearElectronChanheRequest(): Generator<*, *, *> {
  yield takeEvery(actionTypes.CLEAR_ELECTRON_CACHE, clearElectronCacheSaga);
}
