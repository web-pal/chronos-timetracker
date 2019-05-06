// @flow
import * as eff from 'redux-saga/effects';
import {
  remote,
} from 'electron';
import rimraf from 'rimraf';
import path from 'path';
import fs from 'fs';

import {
  actionTypes,
  uiActions,
} from 'actions';
import {
  getUiState,
} from 'selectors';

import {
  setElectronStorage,
} from './helpers';

const keytar = remote.require('keytar');

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

export function* clearElectronCacheSaga() {
  const clearAppDataMessage = [
    'By clicking proceed you will be removing all added accounts and preferences from Chronos.',
    'When the application restarts, it will be as if you are starting Chronos for the first time.',
  ].join(' ');
  const appPath = (
    path.join(
      remote.app.getPath('appData'),
      remote.app.getName(),
    )
  );
  const response = yield eff.call(
    remote.dialog.showMessageBox,
    {
      type: 'warning',
      buttons: ['YES', 'NO'],
      defaultId: 0,
      message: 'Are you sure',
      detail: clearAppDataMessage,
    },
  );
  if (response === 0) {
    yield eff.call(
      setElectronStorage,
      'accounts',
      [],
    );
    const hostname = yield eff.select(
      getUiState('hostname'),
    );
    yield eff.call(
      setElectronStorage,
      `persistUiState_${hostname}`,
      {},
    );
    yield eff.put(uiActions.setUiState({
      readyToQuit: true,
    }));
    if (process.env.NODE_ENV === 'development') {
      yield eff.call(
        remote.session.defaultSession.clearCache,
        () => {},
      );
      yield eff.call(remote.session.defaultSession.clearStorageData);
      remote.getCurrentWindow().webContents.reload();
    } else {
      const accounts = yield eff.call(
        keytar.findCredentials,
        'Chronos',
      );
      yield eff.all(
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
      yield eff.all(
        accounts.map(
          ({ account }) => (
            eff.call(
              keytar.deletePassword,
              'ChronosJWT',
              account,
            )
          ),
        ),
      );
      yield eff.cps(
        rimraf,
        appPath,
      );
      remote.app.relaunch();
      remote.app.exit(0);
    }
  }
}

export function* watchClearElectronChanheRequest(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.CLEAR_ELECTRON_CACHE, clearElectronCacheSaga);
}
