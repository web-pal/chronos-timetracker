import { put, call, cps, select } from 'redux-saga/effects';
import path from 'path';
import fs from 'fs';
import { timerActions } from 'actions';
import Raven from 'raven-js';
import * as Api from 'api';
import { remote } from 'electron';
import {
  getHost,
  getUserData,
  getTimerState,
  getSettingsState,
} from 'selectors';

import { throwError } from './ui';

export function* uploadScreenshot({
  screenshotTime,
  timestamp,
  lastScreenshotPath,
  lastScreenshotThumbPath,
}) {
  try {
    // yield put({ type: types.SET_SCREENSHOT_UPLOAD_STATE, payload: true });

    const isOffline = lastScreenshotPath.includes('offline_screens');
    const fileName = path.basename(lastScreenshotPath);
    const thumbFilename = path.basename(lastScreenshotThumbPath);

    if (!isOffline) {
      yield put(timerActions.setLastScreenshotTime(screenshotTime));
    }

    // upload screenshot
    const image = yield cps(fs.readFile, lastScreenshotPath);
    const { url } = yield call(Api.signUploadUrlForS3Bucket, fileName);
    yield call(Api.uploadScreenshotOnS3Bucket, { url, image });

    // upload thumb
    const thumbImage = yield cps(fs.readFile, lastScreenshotThumbPath);
    const thumbUrlData = yield call(Api.signUploadUrlForS3Bucket, thumbFilename);
    yield call(Api.uploadScreenshotOnS3Bucket, { url: thumbUrlData.url, image: thumbImage });

    const currentScreenshot = `${remote.getGlobal('appDir')}/current_screenshots/${fileName}`;

    yield call(fs.writeFileSync, currentScreenshot, image);

    const screenshot = {
      fileName,
      screenshotTime,
      thumbFilename,
      timestamp,
    };

    yield put(timerActions.addScreenshot(screenshot, screenshotTime));
    yield cps(fs.unlink, lastScreenshotPath);

    if (lastScreenshotThumbPath.length) {
      yield cps(fs.unlink, lastScreenshotThumbPath);
    }

    // yield put({ type: types.SET_SCREENSHOT_UPLOAD_STATE, payload: false });
  } catch (err) {
    const fileName = path.basename(lastScreenshotPath);
    const thumbFilename = path.basename(lastScreenshotThumbPath);
    const isOffline = lastScreenshotPath.includes('offline_screens');
    // TODO determine error
    const mainScreenError = true;
    const thumbScreenError = true;
    //
    if (!isOffline) {
      if (mainScreenError) {
        fs.rename(
          lastScreenshotPath,
          `${remote.getGlobal('appDir')}/offline_screens/${fileName}`,
        );
      }
      if (thumbScreenError) {
        fs.rename(
          lastScreenshotPath,
          `${remote.getGlobal('appDir')}/offline_screens/${thumbFilename}`,
        );
      }
    }
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* rejectScreenshot(screenshotPath) {
  const lastScreenshotTime = yield select(getTimerState('lastScreenshotTime'));
  const time = yield select(getTimerState('time'));
  const timeDiff = time - lastScreenshotTime;
  yield put(timerActions.dismissIdleTime(timeDiff));
  yield cps(fs.unlink, screenshotPath);
}

export function* takeScreenshot() {
  try {
    const screenshotTime = yield select(getTimerState('time'));
    const userData = yield select(getUserData);
    const host = yield select(getHost);
    const localDesktopSettings = yield select(getSettingsState('localDesktopSettings'));
    yield call(
      Api.makeScreenshot,
      screenshotTime,
      userData.key,
      host.hostname,
      localDesktopSettings.showScreenshotPreview,
      localDesktopSettings.screenshotPreviewTime,
      localDesktopSettings.nativeNotifications,
    );
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* cleanExcessScreenshotPeriods() {
  const currentTime = yield select(getTimerState('time'));
  const periods = yield select(getSettingsState('screenshotsPeriod'));
  const newPeriods = periods.filter(p => p > currentTime);

  yield put(timerActions.setScreenshotPeriods(newPeriods));
}
