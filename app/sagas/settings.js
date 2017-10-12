import { call, take, put, select, fork } from 'redux-saga/effects';
import * as Api from 'api';
import { remote } from 'electron';
import Raven from 'raven-js';
import { types, settingsActions } from 'actions';
import { getLocalDesktopSettings } from 'selectors';

import { getFromStorage, setToStorage } from './storage';

export function* getSettings() {
  try {
    const { payload } = yield call(Api.fetchSettings);
    yield put(settingsActions.fillSettings(payload));
  } catch (err) {
    Raven.captureException(err);
  }
}

export function* watchLocalDesktopSettingsChange() {
  while (true) {
    const { payload, meta } = yield take(types.SET_LOCAL_DESKTOP_SETTING);
    if (meta === 'trayShowTimer') {
      const sharedObj = remote.getGlobal('sharedObj');
      sharedObj.trayShowTimer = payload;
    }
    const localSettings = yield select(getLocalDesktopSettings);
    yield call(setToStorage, 'localDesktopSettings', localSettings);
  }
}

export function* localDesktopSettingsFlow() {
  yield take(types.REQUEST_LOCAL_DESKTOP_SETTINGS);
  let settings = yield call(getFromStorage, 'localDesktopSettings');
  if (!settings || !Object.keys(settings).length) {
    settings = {
      showScreenshotPreview: true,
      screenshotPreviewTime: 15,
      nativeNotifications: true,
    };
    yield call(setToStorage, 'localDesktopSettings', settings);
  }
  yield put(settingsActions.fillLocalDesktopSettings(settings));
  yield fork(watchLocalDesktopSettingsChange);
}
