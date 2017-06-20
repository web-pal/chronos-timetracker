import fs from 'fs';
import { cancelled, call, take, race, put, select, fork, cps } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import Raven from 'raven-js';

import { remote, ipcRenderer } from 'electron';
import moment from 'moment';
import uuidV4 from 'uuid/v4';
import rimraf from 'rimraf';

import NanoTimer from 'nanotimer';
import { makeScreenshot } from 'api';
import { idleTimeThreshold } from 'config';
import * as types from '../constants/';
import { uploadWorklog } from './worklogs';
import { savePeriods } from '../actions/timer';
import { randomPeriods, calculateActivity } from './timerHelper';
import { sendInfoLog } from '../helpers/log';

const system = remote.require('@paulcbetts/system-idle-time');

function* takeScreenshot() {
  const screenshotTime = yield select(state => state.timer.time);
  const userData = yield select(state => state.profile.userData);
  const host = yield select(state => state.profile.host);
  const localDesktopSettings = yield select(state => state.settings.localDesktopSettings);

  try {
    yield call(
      makeScreenshot,
      screenshotTime,
      userData.get('key'),
      host,
      localDesktopSettings.get('showScreenshotPreview'),
      localDesktopSettings.get('screenshotPreviewTime'),
      localDesktopSettings.get('nativeNotifications'),
    );
  } catch (err) {
    Raven.captureException(err);
  }
}

function timerChannel() {
  const timer = new NanoTimer();
  let secs = 0;
  return eventChannel((emitter) => {
    timer.setInterval(() => {
      secs += 1;
      emitter(secs);
    }, '', '1s');
    return () => {
      timer.clearInterval();
    };
  });
}

function* runTimer() {
  sendInfoLog('run runTimer');
  const chan = yield call(timerChannel);

  const {
    screenshotsEnabled, screenshotsEnabledUsers, screenshotsQuantity, screenshotsPeriod,
  } = yield select(state => state.settings.toJS());
  const selfKey = yield select(state => state.profile.userData.get('key'));

  const cond1 = screenshotsEnabled === 'everyone';
  const cond2 = screenshotsEnabled === 'forUsers' &&
    screenshotsEnabledUsers.includes(selfKey);
  const cond3 = screenshotsEnabled === 'excludingUsers' &&
    !screenshotsEnabledUsers.includes(selfKey);
  const screensShotsAllowed = cond1 || cond2 || cond3;

  // Initial screenshots periods calculation
  const currentSeconds = moment().format('ss');
  const secondsToMinutesGrid = 60 - currentSeconds;
  // second remaining to end of current Idle-minute period
  const minutes = moment().format('mm');
  // 33
  const minutePeriod = screenshotsPeriod / 60;
  // 10
  const periodNumber = Math.floor(minutes / minutePeriod) + 1;
  // 33/10 + 1 = 4
  const periodRange = (periodNumber * minutePeriod) - minutes;
  // (4 * 10) - 33 = 7
  const screensQnt = Math.round(periodRange / (minutePeriod / screenshotsQuantity)) || 1;
  // 7/(10/1) = 1
  let nextPeriod = (periodRange * 60) - currentSeconds;

  let initialPeriods = [];
  try {
    initialPeriods = randomPeriods(screensQnt, 1, nextPeriod);
  } catch (err) {
    Raven.captureException(err);
  }
  yield put(savePeriods(initialPeriods));

  let idleState = false;
  let prevIdleTime = 0;
  let totalIdleTimeDuringOneMinute = 0;

  try {
    while (true) {
      yield put({ type: types.TICK });

      // Idle check
      const idleTime = system.getIdleTime();
      if (idleState && idleTime < idleTimeThreshold * 1000) {
        idleState = false;
        const currentTime = yield select(state => state.timer.time);
        remote.getGlobal('sharedObj').idleTime = prevIdleTime;
        remote.getGlobal('sharedObj').idleDetails =
          { from: currentTime - (Math.ceil(prevIdleTime / 1000)), to: currentTime };
        ipcRenderer.send('showIdlePopup');
      }
      if (!idleState && idleTime >= idleTimeThreshold * 1000) {
        idleState = true;
      }
      if ((prevIdleTime >= 5 * 1000) && prevIdleTime > idleTime) {
        totalIdleTimeDuringOneMinute += prevIdleTime;
        console.log('New totalIdleTimeDuringOneMinute', totalIdleTimeDuringOneMinute);
      }
      prevIdleTime = idleTime;

      yield take(chan);
      const seconds = yield select(state => state.timer.time);
      // Check offline screenshots
      if (seconds % 240 === 0) {
        yield put({ type: types.CHECK_OFFLINE_SCREENSHOTS });
        yield put({ type: types.CHECK_OFFLINE_WORKLOGS });
      }
      // Screenshots check
      if (screensShotsAllowed) {
        let periods = yield select(state => state.timer.screenShotsPeriods);
        console.log(periods);
        console.log(seconds);
        if (seconds === periods[0]) {
          if (!idleState) {
            console.log('Need to take a screnshot');
            yield fork(takeScreenshot);
            periods.shift();
            yield put(savePeriods(periods));
          }
        }
        if (seconds === nextPeriod) {
          nextPeriod += screenshotsPeriod;
          periods = randomPeriods(screenshotsQuantity, seconds, nextPeriod);
          yield put(savePeriods(periods));
        }
      }

      // Activity check every tracked minute
      const currentTime = yield select(state => state.timer.time);
      if (currentTime % 60 === secondsToMinutesGrid) {
        // totalIdleTimeDuringOneMinute = randomInteger(5 * 1000, 60 * 1000);
        console.log('Add idle', totalIdleTimeDuringOneMinute);
        yield put({ type: types.ADD_IDLE, payload: totalIdleTimeDuringOneMinute });
        totalIdleTimeDuringOneMinute = 0;
      }

      console.log(`timer: ${seconds}`);
    }
  } finally {
    sendInfoLog('stop runTimer');
    if (yield cancelled()) {
      sendInfoLog('stop runTimer cancelled');
      chan.close();
      const issueId = yield select(state => state.issues.meta.trackingIssueId);
      const timeSpentSeconds = yield select(state => state.timer.time);
      const description = yield select(state => state.worklogs.meta.currentDescription);
      const worklogType = yield select(state => state.worklogs.meta.currentWorklogType);

      yield put({ type: types.SET_TIME, payload: 0 });
      yield put({ type: types.SET_CURRENT_DESCRIPTION, payload: '' });
      yield put({ type: types.SELECT_WORKLOG_TYPE, payload: '' });
      sendInfoLog('check timeSpentSeconds', { timeSpentSeconds });
      if (timeSpentSeconds >= 60) {
        const currentIdleList = yield select(state => state.timer.currentIdleList);
        const screenshots = yield select(
          state => state.worklogs.meta.currentWorklogScreenshots.toArray(),
        );
        let activity = [];
        try {
          activity = calculateActivity({
            currentIdleList,
            timeSpentSeconds,
            screenshotsPeriod,
            firstPeriodInMinute: periodRange,
            secondsToMinutesGrid,
          });
        } catch (err) {
          Raven.captureException(err);
        }
        const keepedIdles = yield select(
          state => state.timer.keepedIdles.toArray(),
        );
        sendInfoLog('trying to call uploadWorklog');
        try {
          yield call(
            uploadWorklog, {
              issueId,
              timeSpentSeconds,
              activity,
              keepedIdles,
              screenshots,
              screenshotsPeriod,
              worklogType,
              comment: description,
            },
          );
        } catch (err) {
          Raven.captureException(err);
        }
      } else {
        // Show alert message that you have to track at least 60 seconds
        console.log('Need to track at least 60 seconds');
      }
      const forceQuit = yield select(state => state.timer.forceQuit);
      if (forceQuit) {
        if (typeof forceQuit === 'function') {
          ipcRenderer.send('set-should-quit');
          forceQuit();
        } else {
          ipcRenderer.send('ready-to-quit');
        }
      }
      console.log('timer cancelled');
    }
  }
}

export function* manageTimer() {
  while (true) {
    yield take(types.START_TIMER);

    const selectedIssueId = yield select(state => state.issues.meta.selectedIssueId);
    yield put({ type: types.SET_TRACKING_ISSUE, payload: selectedIssueId });

    const tempId = uuidV4();
    yield put({ type: types.SET_TEMPORARY_ID, payload: tempId });
    yield put({ type: types.SET_TRACKING_ISSUE, payload: selectedIssueId });
    remote.getGlobal('sharedObj').running = true;
    try {
      yield race({
        start: call(runTimer),
        stoped: take(types.STOP_TIMER),
      });
    } catch (err) {
      Raven.captureException(err);
    }
    remote.getGlobal('sharedObj').running = false;
    yield put({ type: types.SET_TEMPORARY_ID, payload: null });
    yield put({ type: types.SET_TRACKING_ISSUE, payload: null });
    yield put({ type: types.CLEAR_CURRENT_SCREENSHOTS });
    try {
      yield cps(rimraf, `${remote.getGlobal('appDir')}/current_screenshots/`);
      yield call(fs.mkdirSync, `${remote.getGlobal('appDir')}/current_screenshots/`);
    } catch (err) {
      Raven.captureException(err);
    }
  }
}

export function* cutIddlesFromLastScreenshot() {
  while (true) {
    yield take(types.CUT_IDDLES_FROM_LAST_SCREENSHOT);
    const lastScreenshotTime = yield select(state => state.timer.lastScreenshotTime);
    const currentTime = yield select(state => state.timer.time);
    yield put({
      type: types.CUT_IDDLES,
      payload: Math.ceil((currentTime - lastScreenshotTime) / 60),
    });
  }
}

export function* normalizePeriods() {
  while (true) {
    yield take(types.NORMALIZE_SCREENSHOTS_PERIODS);
    const currentTime = yield select(state => state.timer.time);
    const periods = yield select(state => state.timer.screenShotsPeriods);

    yield put(savePeriods(periods.filter(p => p > currentTime)));
  }
}

export function* deleteScreenshot() {
  while (true) {
    const action = yield take(types.DELETE_SCREENSHOT_REQUEST);
    const image = action.payload;
    const newImage = { ...image };
    newImage.isDeleted = true;
    const worklogScreenshots = yield select(
      state => state.worklogs.meta.currentWorklogScreenshots,
    );

    const screenshotIndex =
      worklogScreenshots.findIndex(s => s.screenshotTime === image.screenshotTime);

    const oldScreenshot = worklogScreenshots.get(screenshotIndex);
    const newScreenshot = oldScreenshot;
    newScreenshot.isDeleted = true;

    yield put({
      type: types.DELETE_SCREENSHOT_FROM_WORKLOG,
      payload: newScreenshot,
      meta: {
        index: screenshotIndex,
      },
    });

    yield put({
      type: types.DELETE_SCREENSHOT,
      payload: {
        old: image,
        new: newImage,
      },
    });
  }
}
