// @flow
/* eslint-disable no-alert */
import { call, fork, take, put, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { remote, ipcRenderer } from 'electron';
import { uiActions, timerActions, types } from 'actions';
import Raven from 'raven-js';

import { throwError } from './ui';
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
    const { ev } = yield take(updateAvailableChannel);
    yield put(uiActions.setUpdateCheckRunning(false));
    const newVersion = ev.version;
    yield put(uiActions.setUpdateAvailable(newVersion));
  }
}

function* watchUpdateNotAvailable(): Generator<*, *, *> {
  while (true) {
    const meta = yield take(updateNotAvailableChannel);
    yield put(uiActions.setUpdateCheckRunning(false));
    console.log('update not available meta', meta);
  }
}

function* watchUpdateDownloaded(): Generator<*, *, *> {
  while (true) {
    yield take(updateDownloadedChannel);
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
    if (checkUpdates) {
      while (true) {
        yield call(autoUpdater.checkForUpdates);
        yield call(delay, 1 * 60 * 1000); // check for update every minute
      }
    }
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}
