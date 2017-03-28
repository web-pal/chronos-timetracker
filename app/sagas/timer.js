import { cancelled, call, take, race, put, select, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { remote, ipcRenderer } from 'electron';

import NanoTimer from 'nanotimer';
import { makeScreenshot } from 'api';
import { idleTimeThreshold } from 'config';
import * as types from '../constants/';
import { uploadWorklog } from './worklogs';

const system = remote.require('@paulcbetts/system-idle-time');


function randomInteger(min, max) {
  const rand = (min - 0.5) + (Math.random() * ((max - min) + 1));
  return Math.round(rand);
}

function sortNumber(a, b) {
  return a - b;
}
// TODO: Move all saga's selectors to selectors module


function* takeScreenshot() {
  const screenshotTime = yield select(state => state.timer.time);
  yield call(makeScreenshot, screenshotTime);
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

  let periods = [...Array(screenshotsQuantity).keys()]
    .map(() => randomInteger(60, screenshotsPeriod)).sort(sortNumber);
  let idleState = false;
  let prevIdleTime = 0;
  let totalIdleTimeDuringOneMinute = 0;
  let nextPeriod = screenshotsPeriod;

  try {
    while (true) {
      yield put({ type: types.TICK });

      // Idle check
      const idleTime = system.getIdleTime();
      if (idleState && idleTime < idleTimeThreshold * 1000) {
        idleState = false;
        remote.getGlobal('sharedObj').idleTime = prevIdleTime;
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

      const seconds = yield take(chan);
      // Check offline screenshots
      if (seconds % 240 === 0) {
        yield put({ type: types.CHECK_OFFLINE_SCREENSHOTS });
        yield put({ type: types.CHECK_OFFLINE_WORKLOGS });
      }
      // Screenshots check
      if (screensShotsAllowed) {
        if (seconds === periods[0]) {
          if (!idleState) {
            yield fork(takeScreenshot);
            console.log('Need to take a screnshot');
          }
          periods.shift();
        }
        if (seconds === nextPeriod) {
          nextPeriod += screenshotsPeriod;
          periods = [...Array(screenshotsQuantity).keys()]
            .map(() => randomInteger(seconds, nextPeriod)).sort(sortNumber); // eslint-disable-line
        }
      }

      // Activity check every tracked minute
      const currentTime = yield select(state => state.timer.time);
      if (currentTime % 60 === 0) {
        console.log('Add idle', totalIdleTimeDuringOneMinute);
        yield put({ type: types.ADD_IDLE, payload: totalIdleTimeDuringOneMinute });
        totalIdleTimeDuringOneMinute = 0;
      }

      console.log(`timer: ${seconds}`);
    }
  } finally {
    if (yield cancelled()) {
      chan.close();
      const issueId = yield select(state => state.issues.meta.trackingIssueId);
      const timeSpentSeconds = yield select(state => state.timer.time);
      const description = yield select(state => state.worklogs.meta.currentDescription);

      yield put({ type: types.SET_TIME, payload: 0 });
      yield put({ type: types.SET_CURRENT_DESCRIPTION, payload: '' });
      if (timeSpentSeconds >= 60) {
        yield call(
          uploadWorklog,
          { issueId, timeSpentSeconds, comment: description },
        );
      } else {
        // Show alert message that you have to track at least 60 seconds
        console.log('Need to track at least 60 seconds');
      }
      const forceQuit = yield select(state => state.timer.forceQuit);
      if (forceQuit) {
        ipcRenderer.send('ready-to-quit');
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

    remote.getGlobal('sharedObj').running = true;
    yield race({
      start: call(runTimer),
      stoped: take(types.STOP_TIMER),
    });
    remote.getGlobal('sharedObj').running = false;

    yield put({ type: types.SET_TRACKING_ISSUE, payload: null });
  }
}

export function* cutIddlesFromLastScreenshot() {
  while (true) {
    yield take(types.CUT_IDDLES_FROM_LAST_SCREENSHOT);
    const lastScreenshotTime = yield select(state => state.timer.lastScreenshotTime);
    const currentTime = yield select(state => state.timer.time);
    yield put({
      type: types.CUT_IDDLES,
      payload: Math.ceil(currentTime - lastScreenshotTime) / 60,
    });
  }
}
