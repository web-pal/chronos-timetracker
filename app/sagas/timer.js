import { call, race, take, select, put, takeEvery, cancel } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import NanoTimer from 'nanotimer';
import { remote, ipcRenderer } from 'electron';
import {
  getUserData,
  getTimerTime,
  getScreenshotsSettings,
  getScreenshotPeriods,
  getTimerIdleState,
} from 'selectors';
import Raven from 'raven-js';
import { uiActions, timerActions, types } from 'actions';
import { idleTimeThreshold } from 'config';

import { throwError } from './ui';

const system = remote.require('@paulcbetts/system-idle-time');

function* isScreenshotsAllowed() {
  try {
    const {
      screenshotsEnabled,
      screenshotsEnabledUsers,
    } = yield select(getScreenshotsSettings);
    const { key } = yield select(getUserData);
    const cond1 = screenshotsEnabled === 'everyone';
    const cond2 = screenshotsEnabled === 'forUsers' &&
      screenshotsEnabledUsers.includes(key);
    const cond3 = screenshotsEnabled === 'excludingUsers' &&
      !screenshotsEnabledUsers.includes(key);
    return cond1 || cond2 || cond3;
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
    return false;
  }
}

function timerChannel() {
  const ticker = new NanoTimer();
  let secs = 0;
  return eventChannel((emitter) => {
    ticker.setInterval(() => {
      secs += 1;
      emitter(secs);
    }, '', '1s');
    return () => {
      ticker.clearInterval();
    };
  });
}

let prevIdleTime = 0;
let totalIdleTimeDuringOneMinute = 0;

function* idleCheck() {
  try {
    const idleTime = system.getIdleTime();
    const idleState = yield select(getTimerIdleState);
    if (idleState && idleTime < idleTimeThreshold * 1000) {
      yield put(timerActions.setIdleState(false));
      const currentTime = yield select(getTimerTime);
      remote.getGlobal('sharedObj').idleTime = prevIdleTime;
      remote.getGlobal('sharedObj').idleDetails =
        { from: currentTime - (Math.ceil(prevIdleTime / 1000)), to: currentTime };
      ipcRenderer.send('showIdlePopup');
    }
    if (!idleState && idleTime >= idleTimeThreshold * 1000) {
      yield put(timerActions.setIdleState(true));
    }
    if ((prevIdleTime >= 5 * 1000) && prevIdleTime > idleTime) {
      totalIdleTimeDuringOneMinute += prevIdleTime;
    }
    prevIdleTime = idleTime;
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

function* screenshotsCheck() {
  try {
    const screenshotsAllowed = yield call(isScreenshotsAllowed);
    if (!screenshotsAllowed) yield cancel();
    const time = yield select(getTimerTime);
    const idleState = yield select(getTimerIdleState);
    const periods = yield select(getScreenshotPeriods);
    if (time === periods[0]) {
      if (!idleState) {
        /* yield fork(takeScreenshot); */
        periods.shift();
        /* yield put(savePeriods(periods)); */
      }
    }
    /* if (time === nextPeriod) {
      nextPeriod += screenshotsPeriod;
      periods = randomPeriods(screenshotsQuantity, seconds, nextPeriod);
      yield put(savePeriods(periods));
    } */
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

function setTimeToTray(time) {
  if (remote.getGlobal('sharedObj').trayShowTimer) {
    const humanFormat = new Date(time * 1000).toISOString().substr(11, 5);
    remote.getGlobal('tray').setTitle(humanFormat);
  }
}

function* timerStep() {
  try {
    yield put(timerActions.tick());
    yield call(idleCheck);
    yield call(screenshotsCheck);
    const time = yield select(getTimerTime);
    yield call(setTimeToTray, time);
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* timer(): Generator<*, *, *> {
  try {
    yield call(ipcRenderer.send, 'startTimer');
    const channel = yield call(timerChannel);
    const { stopped } = yield race({
      running: takeEvery(channel, timerStep),
      stopped: take(types.STOP_TIMER),
    });
    if (stopped) {
      const time = yield select(getTimerTime);
      if (time < 60) {
        yield put(uiActions.setAlertModalOpen(true));
      } else {
        yield put(timerActions.stopTimer());
      }
    }
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchStartTimer() {
  yield takeEvery(types.START_TIMER, timer);
}
