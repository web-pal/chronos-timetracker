import { call, take, put } from 'redux-saga/effects';
import * as Api from 'api';
import Raven from 'raven-js';
import { types, settingsActions } from 'actions';

import { getFromStorage, setToStorage } from './storage';

export function* getSettings() {
  try {
    const { payload } = yield call(Api.fetchSettings);
    yield put(settingsActions.fillSettings(payload));
  } catch (err) {
    Raven.captureException(err);
  }
}

export function* localDesktopSettingsFlow() {
  while (true) {
    yield take(types.LOCAL_DESKTOP_SETTINGS_REQUEST);
    let settings = yield call(getFromStorage, 'localDesktopSettings');
    if (!Object.keys(settings).length) {
      settings = {
        showScreenshotPreview: true,
        screenshotPreviewTime: 15,
        nativeNotifications: true,
      };
      yield call(setToStorage, 'localDesktopSettings', settings);
    }
    yield put({ type: types.FILL_LOCAL_DESKTOP_SETTINGS, payload: settings });
  }
}
