import * as eff from 'redux-saga/effects';
import path from 'path';
import fs from 'fs';
import {
  timerActions,
} from 'actions';
import Raven from 'raven-js';
import {
  remote,
} from 'electron';
import {
  getUiState,
  getUserData,
  getTimerState,
  getSettingsState,
} from 'selectors';

import {
  throwError,
} from './ui';

const Api = () => 'deprecated';

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
      yield eff.put(timerActions.setLastScreenshotTime(screenshotTime));
    }

    // upload screenshot
    const image = yield eff.cps(fs.readFile, lastScreenshotPath);
    const { url } = yield eff.call(Api.signUploadUrlForS3Bucket, fileName);
    yield eff.call(Api.uploadScreenshotOnS3Bucket, { url, image });

    // upload thumb
    const thumbImage = yield eff.cps(fs.readFile, lastScreenshotThumbPath);
    const thumbUrlData = yield eff.call(Api.signUploadUrlForS3Bucket, thumbFilename);
    yield eff.call(Api.uploadScreenshotOnS3Bucket, { url: thumbUrlData.url, image: thumbImage });

    const currentScreenshot = `${remote.getGlobal('appDir')}/current_screenshots/${fileName}`;

    yield eff.call(fs.writeFileSync, currentScreenshot, image);

    const screenshot = {
      fileName,
      screenshotTime,
      thumbFilename,
      timestamp,
    };

    yield eff.put(timerActions.addScreenshot(screenshot, screenshotTime));
    yield eff.cps(fs.unlink, lastScreenshotPath);

    if (lastScreenshotThumbPath.length) {
      yield eff.cps(fs.unlink, lastScreenshotThumbPath);
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
    yield eff.call(throwError, err);
    Raven.captureException(err);
  }
}

export function* rejectScreenshot(screenshotPath) {
  const lastScreenshotTime = yield eff.select(getTimerState('lastScreenshotTime'));
  const time = yield eff.select(getTimerState('time'));
  const timeDiff = time - lastScreenshotTime;
  yield eff.put(timerActions.dismissIdleTime(timeDiff));
  yield eff.cps(fs.unlink, screenshotPath);
}

export function* takeScreenshot() {
  try {
    const screenshotTime = yield eff.select(getTimerState('time'));
    const userData = yield eff.select(getUserData);
    const host = yield eff.select(getUiState('host'));
    const localDesktopSettings = yield eff.select(getSettingsState('localDesktopSettings'));
    yield eff.call(
      Api.makeScreenshot,
      screenshotTime,
      userData.key,
      host.hostname,
      localDesktopSettings.showScreenshotPreview,
      localDesktopSettings.screenshotPreviewTime,
      localDesktopSettings.nativeNotifications,
    );
  } catch (err) {
    yield eff.call(throwError, err);
    Raven.captureException(err);
  }
}

export function* cleanExcessScreenshotPeriods() {
  const currentTime = yield eff.select(getTimerState('time'));
  const periods = yield eff.select(getSettingsState('screenshotsPeriod'));
  const newPeriods = periods.filter(p => p > currentTime);

  yield eff.put(timerActions.setScreenshotPeriods(newPeriods));
}
