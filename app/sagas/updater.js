// @flow
/* eslint-disable no-alert */
import { call, fork, take, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { remote, ipcRenderer } from 'electron';
import { uiActions, timerActions, types } from 'actions';
import Raven from 'raven-js';
import { getLocalDesktopSettings } from 'selectors';

import { throwError, infoLog } from './ui';
import { checkUpdates } from '../utils/config';
import createIpcChannel from './ipc';

const { autoUpdater } = remote.require('electron-updater');
const log = remote.require('electron-log');

let checkingForUpdatesChannel;
let updateAvailableChannel;
let updateNotAvailableChannel;
let updateDownloadedChannel;

autoUpdater.autoDownload = false;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

export function* watchInstallUpdateRequest(): Generator<*, *, *> {
  while (true) {
    yield take(types.INSTALL_UPDATE_REQUEST);
    yield call(
      infoLog,
      'downloading update...',
    );
    yield put(uiActions.setUpdateFetching(true));
    yield call(autoUpdater.downloadUpdate);
  }
}

function* watchCheckingForUpdates(): Generator<*, *, *> {
  while (true) {
    yield take(checkingForUpdatesChannel);
    yield put(uiActions.setUpdateCheckRunning(true));
  }
}

function* watchUpdateAvailable(): Generator<*, *, *> {
  while (true) {
    const meta = yield take(updateAvailableChannel);
    const ev = meta.ev;
    yield call(
      infoLog,
      'update is availible',
      meta,
    );
    yield put(uiActions.setUpdateCheckRunning(false));
    const newVersion = ev.version;
    yield put(uiActions.setUpdateAvailable(newVersion));
  }
}

function* watchUpdateNotAvailable(): Generator<*, *, *> {
  while (true) {
    const meta = yield take(updateNotAvailableChannel);
    yield call(
      infoLog,
      'update is not availible',
      meta,
    );
    yield put(uiActions.setUpdateCheckRunning(false));
  }
}

function* watchUpdateDownloaded(): Generator<*, *, *> {
  while (true) {
    const meta = yield take(updateDownloadedChannel);
    yield call(
      infoLog,
      'update downloaded!',
      meta,
    );
    yield put(uiActions.setUpdateFetching(false));
    const { getGlobal } = remote;
    yield call(delay, 500);
    if (window.confirm('App updated, restart now?')) {
      const { running, uploading } = getGlobal('sharedObj');
      if (uploading) {
        window.alert('Currently app in process of saving worklog, wait few seconds and restart app');
      } else {
        if (running) { // eslint-disable-line
          if (window.confirm('Tracking in progress, save worklog before restart?')) {
            yield put(timerActions.stopTimerRequest());
          }
        } else {
          ipcRenderer.send('set-should-quit');
          autoUpdater.quitAndInstall();
        }
      }
    }
  }
}

export function* checkForUpdatesFlow(): Generator<*, *, *> {
  try {
    while (true) {
      yield take(types.CHECK_FOR_UPDATES_REQUEST);
      const { updateChannel } = yield select(getLocalDesktopSettings);
      yield call(
        infoLog,
        `check for updates request for channel ${updateChannel}`,
      );

      if (updateChannel === 'beta') {
        autoUpdater.allowPrerelease = true;
      } else if (updateChannel === 'stable') {
        autoUpdater.allowPrerelease = false;
      }

      yield call(autoUpdater.checkForUpdates);
    }
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* initializeUpdater(): Generator<*, *, *> {
  try {
    checkingForUpdatesChannel = yield call(createIpcChannel, 'checking-for-update', autoUpdater);
    yield fork(watchCheckingForUpdates);
    updateAvailableChannel = yield call(createIpcChannel, 'update-available', autoUpdater);
    yield fork(watchUpdateAvailable);
    updateNotAvailableChannel = yield call(createIpcChannel, 'update-not-available', autoUpdater);
    yield fork(watchUpdateNotAvailable);
    updateDownloadedChannel = yield call(createIpcChannel, 'update-downloaded', autoUpdater);
    yield fork(watchUpdateDownloaded);

    const { autoCheckForUpdates } = yield select(getLocalDesktopSettings);
    if (checkUpdates && autoCheckForUpdates) {
      const checkEvery = 10 * 60 * 1000;
      yield call(
        infoLog,
        `automatically checking for updates every ${checkEvery} seconds`,
      );
      while (true) {
        yield put(uiActions.checkForUpdatesRequest());
        yield call(delay, checkEvery); // check for update every 10 minutes
      }
    }
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}
