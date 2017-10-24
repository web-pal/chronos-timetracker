import { call, take, put, select, fork } from 'redux-saga/effects';
import * as Api from 'api';
import { remote } from 'electron';
import Raven from 'raven-js';
import { types, settingsActions, uiActions } from 'actions';
import { getLocalDesktopSettings } from 'selectors';
import { infoLog } from './ui';

import { getFromStorage, setToStorage } from './storage';

export function* getSettings() {
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
    yield put(settingsActions.fillSettings(payload));
  } catch (err) {
    Raven.captureException(err);
  }
}

export function* watchLocalDesktopSettingsChange() {
  while (true) {
    const { payload, meta } = yield take(types.SET_LOCAL_DESKTOP_SETTING);
    yield call(
      infoLog,
      'set local desktop setting request',
      {
        key: meta,
        payload,
      },
    );
    if (meta === 'trayShowTimer' && !payload) {
      remote.getGlobal('tray').setTitle('');
    }
    if (meta === 'updateChannel') {
      yield call(
        infoLog,
        `switched updateChannel to ${payload}, checking for updates...`,
      );
      yield put(uiActions.checkForUpdatesRequest());
    }
    const newLocalSettings = yield select(getLocalDesktopSettings);
    newLocalSettings[meta] = payload;
    yield call(
      infoLog,
      'new local desktop settings = ',
      newLocalSettings,
    );
    yield call(setToStorage, 'localDesktopSettings', newLocalSettings);
  }
}

export function* localDesktopSettingsFlow() {
  yield take(types.REQUEST_LOCAL_DESKTOP_SETTINGS);
  yield call(
    infoLog,
    'local desktop settings requested',
  );
  let settings = yield call(getFromStorage, 'localDesktopSettings');
  yield call(
    infoLog,
    'got local desktop settings from storage',
    settings,
  );
  if (!settings || !Object.keys(settings).length) {
    settings = {
      showScreenshotPreview: true,
      screenshotPreviewTime: 15,
      nativeNotifications: true,
      updateChannel: 'stable',
      autoCheckForUpdates: true,
    };
    yield call(
      infoLog,
      'local desktop settings is NULL, setting them to defaults',
      settings,
    );
    yield call(setToStorage, 'localDesktopSettings', settings);
  }

  // backwards compatibility
  if (!settings.updateChannel) settings.updateChannel = 'stable';
  if (!settings.autoCheckForUpdates) settings.autoCheckForUpdates = true;
  // 

  yield put(settingsActions.fillLocalDesktopSettings(settings));
  yield fork(watchLocalDesktopSettingsChange);
}
