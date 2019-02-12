import path from 'path';
import {
  dialog,
} from 'electron';
import {
  autoUpdater,
  CancellationToken,
} from 'electron-updater';

import {
  call,
  put,
  take,
  takeEvery,
  fork,
} from 'redux-saga/effects';
import {
  eventChannel,
} from 'redux-saga';

import {
  actionTypes,
} from 'shared/actions';

autoUpdater.autoDownload = false;

if (process.env.NODE_ENV === 'development') {
  autoUpdater.updateConfigPath = path.join(process.cwd(), 'dev-app-update.yml');
  autoUpdater.allowDowngrade = true;
}

function* setRendererUiState(key, value) {
  yield put({
    type: actionTypes.SET_UI_STATE,
    payload: {
      key,
      value,
    },
    scope: 'mainRenderer',
  });
}

function createUpdaterChannel({ updater, event }) {
  return eventChannel((emitter) => {
    updater.on(event, emitter);

    return () => {
      updater.removeListener(event, emitter);
    };
  });
}

function* onUpdateAvailable({ channel }) {
  const update = yield take(channel);
  yield call(setRendererUiState, 'hasUpdate', update);
  channel.close();
}

function* onUpdateNotAvailable({ channel }) {
  yield take(channel);
  yield call(setRendererUiState, 'hasUpdate', false);
  channel.close();
}

function showMessageBoxAsync(options) {
  return new Promise((resolve) => {
    function callback(response) {
      resolve(response);
    }
    dialog.showMessageBox(options, callback);
  });
}

function* onUpdateDownloaded({ channel }) {
  yield take(channel);

  yield call(setRendererUiState, 'downloadedUpdate', true);

  const buttonIndex = yield call(showMessageBoxAsync, {
    type: 'info',
    title: 'Install Updates',
    message: 'Do you want update now?',
    buttons: ['Sure', 'No'],
  });
  if (buttonIndex === 0) {
    yield put({
      type: actionTypes.SET_WILL_QUIT_STATE,
      payload: true,
    });
    if (process.env.NODE_ENV === 'production') {
      const isSilent = process.platform === 'windows';
      const isForceRunAfter = true;
      autoUpdater.quitAndInstall(isSilent, isForceRunAfter);
    }
  }
  channel.close();
}

function* onDownloadProgress({ channel }) {
  while (true) {
    const progress = yield take(channel);
    yield call(setRendererUiState, 'downloadUpdateProgress', progress);
    if (progress.percent === 100) {
      channel.close();
    }
  }
}

function* checkUpdates() {
  const updateAvailable = createUpdaterChannel({
    updater: autoUpdater,
    event: 'update-available',
  });

  yield fork(onUpdateAvailable, {
    channel: updateAvailable,
  });

  const updateNotAvailable = createUpdaterChannel({
    updater: autoUpdater,
    event: 'update-not-available',
  });

  yield fork(onUpdateNotAvailable, {
    channel: updateNotAvailable,
  });

  try {
    autoUpdater.checkForUpdates();
  } catch (e) {
    console.log(e);
  }
}


function* onError({ channel }) {
  const message = yield take(channel);
  console.error('There was a problem updating the application');
  console.log(message);
}

export function* downloadUpdate() {
  const downloadProgress = createUpdaterChannel({
    updater: autoUpdater,
    event: 'download-progress',
  });

  yield fork(onDownloadProgress, {
    channel: downloadProgress,
  });

  const updateDownloaded = createUpdaterChannel({
    updater: autoUpdater,
    event: 'update-downloaded',
  });

  yield fork(onUpdateDownloaded, {
    channel: updateDownloaded,
  });

  const errorUpdate = createUpdaterChannel({
    updater: autoUpdater,
    event: 'error',
  });

  yield fork(onError, {
    channel: errorUpdate,
  });

  try {
    const cancellationToken = new CancellationToken();
    yield autoUpdater.downloadUpdate(cancellationToken);
  } catch (e) {
    console.log(e);
  }
}

export function* updaterFlow() {
  yield takeEvery(actionTypes.CHECK_UPDATES_REQUEST, checkUpdates);
  yield takeEvery(actionTypes.DOWNLOAD_UPDATE_REQUEST, downloadUpdate);
}
