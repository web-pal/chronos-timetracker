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

function* setRendererUiState(
  keyOrRootValues,
  maybeValues,
) {
  yield put({
    type: actionTypes.SET_UI_STATE,
    payload: {
      keyOrRootValues,
      maybeValues,
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
  yield call(
    setRendererUiState,
    {
      updateAvailable: update.releaseName,
    },
  );
  channel.close();
}

function* onUpdateNotAvailable({ channel }) {
  yield take(channel);
  yield call(
    setRendererUiState,
    {
      updateAvailable: false,
    },
  );
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
  const update = yield take(channel);

  yield call(
    setRendererUiState,
    {
      downloadedUpdate: true,
    },
  );

  function parseReleaseNotes(releaseNotes) {
    return releaseNotes
      .replace(/<style([\s\S]*?)<\/style>/gi, '')
      .replace(/<script([\s\S]*?)<\/script>/gi, '')
      .replace(/<\/div>/ig, '\n')
      .replace(/<\/li>/ig, '\n')
      .replace(/<li>/ig, '  *  ')
      .replace(/<\/ul>/ig, '\n')
      .replace(/<\/h2>/ig, '\n')
      .replace(/<\/h3>/ig, '\n')
      .replace(/<\/p>/ig, '\n')
      .replace(/<br\s*[/]?>/gi, '\n')
      .replace(/<[^>]+>/ig, '');
  }

  const releaseNotes = parseReleaseNotes(update.releaseNotes.trim());
  const buttonIndex = yield call(showMessageBoxAsync, {
    type: 'info',
    title: 'Install Updates',
    message: (
      `New version is available:\n\n${releaseNotes}\nWould you like to install it now?`
    ),
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
    yield call(
      setRendererUiState,
      {
        downloadUpdateProgress: progress.percent,
      },
    );
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
  console.log('DOWNLOAD ERROR');
  console.error('There was a problem updating the application');
  console.log(message);
}

export function* downloadUpdate() {
  console.log('***********');
  console.log('DOWNLOAD REQUEST');
  console.log('***********');
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

function setUpdateSettings({
  autoDownload,
  allowPrerelease,
}) {
  autoUpdater.autoDownload = autoDownload;
  autoUpdater.allowPrerelease = allowPrerelease;
}

export function* updaterFlow() {
  yield takeEvery(actionTypes.CHECK_UPDATES_REQUEST, checkUpdates);
  yield takeEvery(actionTypes.DOWNLOAD_UPDATE_REQUEST, downloadUpdate);
  yield takeEvery(actionTypes.SET_UPDATE_SETTINGS, setUpdateSettings);
}
