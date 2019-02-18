// @flow
import * as eff from 'redux-saga/effects';
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
    yield eff.call(
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
      yield eff.call(
        infoLog,
        `switched updateAutomatically to ${value}`,
      );

      if (value) {
        yield eff.put(uiActions.checkForUpdatesRequest());
      }
    }

    if (settingName === 'updateChannel') {
      yield eff.call(
        infoLog,
        `switched updateChannel to ${value}, checking for updates...`,
      );
      yield eff.put(uiActions.checkForUpdatesRequest());
    }
  } catch (err) {
    yield eff.call(throwError, err);
  }
}

export function* watchLocalDesktopSettingsChange(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.SET_LOCAL_DESKTOP_SETTING, onChangeLocalDesktopSettings);
}

function* removeAllIn(dir, pathName) {
  const p = path.join(dir, pathName);
  const stat = yield eff.cps(fs.lstat, p);
  if (stat.isDirectory()) {
    yield eff.call(removeDir, p); // eslint-disable-line
  } else {
    yield eff.cps(fs.unlink, p);
    console.log(`Removed file ${p}`);
  }
}

function* removeDir(dir) {
  const exists = yield eff.cps(fs.lstat, dir);
  if (exists) {
    const files = yield eff.cps(fs.readdir, dir);
    yield eff.all(
      files.map(fileName => eff.call(removeAllIn, dir, fileName)),
    );
    yield eff.cps(fs.rmdir, dir);
    console.log(`Removed dir ${dir}`);
  }
}

const keytar = remote.require('keytar');
function* clearElectronCacheSaga(): Generator<*, *, *> {
  try {
    yield eff.call(
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
    const accounts = yield eff.call(
      keytar.findCredentials,
      'Chronos',
    );
    yield eff.call(
      accounts.map(
        ({ account }) => (
          eff.call(
            keytar.deletePassword,
            'Chronos',
            account,
          )
        ),
      ),
    );

    const hostname = yield eff.select(
      uiActions.getUiState2('hostname'),
    );
    yield eff.call(
      setElectronStorage,
      `persistUiState_${hostname}`,
      {},
    );
    yield eff.call(
      setElectronStorage,
      'accounts',
      [],
    );
    yield eff.call(
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
  yield eff.takeEvery(actionTypes.CLEAR_ELECTRON_CACHE, clearElectronCacheSaga);
}
