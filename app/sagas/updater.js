// @flow
/* eslint-disable no-alert */
import { call, fork, take, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { remote, ipcRenderer } from 'electron';
import { checkUpdates } from '../utils/config';
import createIpcChannel from './ipc';
import { uiActions, timerActions, types } from './ui';

const { autoUpdater } = remote.require('electron-updater');

let checkingForUpdatesChannel;
let updateAvailableChannel;
let updateNotAvailableChannel;
let updateDownloadedChannel;

export function* watchInstallUpdateRequest(): Generator<*, *, *> {
  while (true) {
    yield take(types.INSTALL_UPDATE_REQUEST);
    autoUpdater.downloadUpdate();
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
    yield put(uiActions.setUpdateCheckRunning(false));
    console.log('update available meta', meta);
    yield put(uiActions.setUpdateAvailable(meta));
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
      autoUpdater.checkForUpdates();
      yield call(delay, 1 * 60 * 1000); // check for update every minute
    }
  }
}
