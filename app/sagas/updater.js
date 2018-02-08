// @flow
import {
  delay,
} from 'redux-saga';
import {
  call,
  fork,
  take,
  put,
  select,
} from 'redux-saga/effects';
import {
  remote,
  ipcRenderer,
} from 'electron';

import config from 'config';
import {
  actionTypes,
  uiActions,
  timerActions,
} from 'actions';
import {
  getSettingsState,
} from 'selectors';

import {
  throwError,
  infoLog,
} from './ui';
import createIpcChannel from './ipc';

import {
  trackMixpanel,
  incrementMixpanel,
} from '../utils/stat';


const {
  autoUpdater,
} = remote.require('electron-updater');
const log = remote.require('electron-log');

let checkingForUpdatesChannel;
let updateAvailableChannel;
let updateNotAvailableChannel;
let updateDownloadedChannel;

let newVersion = null;
let updateDownloaded = false;
autoUpdater.autoDownload = true;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

export function* watchInstallUpdateRequest(): Generator<*, *, *> {
  while (true) {
    yield take(actionTypes.INSTALL_UPDATE_REQUEST);
    yield call(
      infoLog,
      'downloading update...',
    );
    yield put(uiActions.setUiState('updateFetching', true));
    if (updateDownloaded) {
      ipcRenderer.send('set-should-quit');
      autoUpdater.quitAndInstall();
    } else {
      yield call(autoUpdater.downloadUpdate);
    }
  }
}

function* watchCheckingForUpdates(): Generator<*, *, *> {
  while (true) {
    yield take(checkingForUpdatesChannel);
    yield put(uiActions.setUiState('updateCheckRunning', true));
  }
}

function* watchUpdateAvailable(): Generator<*, *, *> {
  while (true) {
    const meta = yield take(updateAvailableChannel);
    const { ev } = meta;
    yield call(
      infoLog,
      'update is availible',
      meta,
    );
    yield put(uiActions.setUiState('updateFetching', true));
    newVersion = ev.version;
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
    yield put(uiActions.setUiState('updateCheckRunning', false));
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
    yield put(uiActions.setUiState('updateAvailable', newVersion));
    yield put(uiActions.setUiState('updateFetching', false));
    const { getGlobal } = remote;
    yield call(delay, 500);
    if (!updateDownloaded) {
      updateDownloaded = true;
      trackMixpanel('Update installed');
      incrementMixpanel('Update installed', 1);
      if (window.confirm('New version is available. Do you like to install it now?')) {
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
}

export function* checkForUpdatesFlow(): Generator<*, *, *> {
  try {
    while (true) {
      yield take(actionTypes.CHECK_FOR_UPDATES_REQUEST);
      const { updateChannel } = yield select(getSettingsState('localDesktopSettings'));
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

    if (config.checkUpdates) {
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
  }
}
