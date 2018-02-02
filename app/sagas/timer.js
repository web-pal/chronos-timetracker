// @flow
import {
  call,
  take,
  fork,
  select,
  put,
  takeEvery,
  cancel,
} from 'redux-saga/effects';
import {
  eventChannel,
} from 'redux-saga';
import {
  remote,
  ipcRenderer,
} from 'electron';
import moment from 'moment';
import NanoTimer from 'nanotimer';

import config from 'config';
import {
  randomPeriods,
  calculateActivity,
} from 'timer-helper';

import {
  actionTypes,
  uiActions,
  timerActions,
} from 'actions';
import {
  getUserData,
  getTimerTime,
  getTimerRunning,
  getScreenshotsSettings,
  getScreenshots,
  getScreenshotPeriods,
  getTimerIdleState,
  getWorklogComment,
  getLocalDesktopSettings,
  getKeepedIdles,
  getIdles,
  getUiState,
} from 'selectors';

import {
  throwError,
  infoLog,
} from './ui';
import {
  uploadWorklog,
} from './worklogs';
import {
  uploadScreenshot,
  rejectScreenshot,
  takeScreenshot,
  cleanExcessScreenshotPeriods,
} from './screenshots';
import createIpcChannel from './ipc';


const system = remote.require('@paulcbetts/system-idle-time');

function* isScreenshotsAllowed() {
  try {
    const {
      screenshotsEnabled,
      screenshotsEnabledUsers,
    } = yield select(getScreenshotsSettings);
    yield call(
      infoLog,
      'checking if screenshots is allowed',
      { screenshotsEnabled, screenshotsEnabledUsers },
    );

    const { key } = yield select(getUserData);
    const cond1 = screenshotsEnabled === 'everyone';
    const cond2 = screenshotsEnabled === 'forUsers' &&
      screenshotsEnabledUsers.includes(key);
    const cond3 = screenshotsEnabled === 'excludingUsers' &&
      !screenshotsEnabledUsers.includes(key);
    const screenshotsAllowed = cond1 || cond2 || cond3;
    yield put(uiActions.setUiState('screenshotsAllowed', screenshotsAllowed));
    return screenshotsAllowed;
  } catch (err) {
    yield call(throwError, err);
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
    const currentTime = yield select(getTimerTime);
    if (idleState && idleTime < config.idleTimeThreshold * 1000) {
      yield put(timerActions.setIdleState(false));
      remote.getGlobal('sharedObj').idleTime = prevIdleTime;
      remote.getGlobal('sharedObj').idleDetails =
        { from: currentTime - (Math.ceil(prevIdleTime / 1000)), to: currentTime };
      ipcRenderer.send('show-idle-popup');
    }
    if (!idleState && idleTime >= config.idleTimeThreshold * 1000) {
      yield put(timerActions.setIdleState(true));
    }
    if ((prevIdleTime >= 5 * 1000) && prevIdleTime > idleTime) {
      totalIdleTimeDuringOneMinute += prevIdleTime;
    }
    prevIdleTime = idleTime;
  } catch (err) {
    yield call(throwError, err);
  }
}

let nextPeriod;

function* screenshotsCheck() {
  try {
    const { screenshotsQuantity, screenshotsPeriod } = yield select(getScreenshotsSettings);
    const time = yield select(getTimerTime);
    const idleState = yield select(getTimerIdleState);
    let periods = yield select(getScreenshotPeriods);
    if (time === periods[0]) {
      if (!idleState) {
        yield fork(takeScreenshot);
        periods.shift();
        yield put(timerActions.setScreenshotPeriods(periods));
      }
    }
    if (time === nextPeriod) {
      nextPeriod += screenshotsPeriod;
      periods = randomPeriods(screenshotsQuantity, time, nextPeriod);
      yield call(infoLog, 'created new screenshot periods', periods);
      yield put(timerActions.setScreenshotPeriods(periods));
    }
  } catch (err) {
    yield call(throwError, err);
  }
}

function* activityCheck(secondsToMinutesGrid) {
  try {
    const time = yield select(getTimerTime);
    if (time % 60 === secondsToMinutesGrid) {
      yield call(
        infoLog,
        `add idle time -- ${totalIdleTimeDuringOneMinute} seconds`,
      );
      const idle = {
        from: time - totalIdleTimeDuringOneMinute,
        to: time,
      };
      yield put(timerActions.addIdleTime(idle));
      totalIdleTimeDuringOneMinute = 0;
    }
  } catch (err) {
    yield call(throwError, err);
  }
}

function* setTimeToTray() {
  const time = yield select(getTimerTime);
  const localDesktopSettings = yield select(getLocalDesktopSettings);
  const { trayShowTimer } = localDesktopSettings;
  if (trayShowTimer) {
    const humanFormat = new Date(time * 1000).toISOString().substr(11, 5);
    remote.getGlobal('tray').setTitle(humanFormat);
  }
}

function* timerStep(screenshotsAllowed, secondsToMinutesGrid) {
  try {
    yield put(timerActions.tick());
    yield call(idleCheck, secondsToMinutesGrid);
    if (screenshotsAllowed) {
      yield call(screenshotsCheck, nextPeriod);
    }
    yield call(activityCheck, secondsToMinutesGrid);
    yield call(setTimeToTray);
  } catch (err) {
    yield call(throwError, err);
  }
}


export function* runTimer(channel: any): Generator<*, *, *> {
  const {
    screenshotsPeriod,
    screenshotsQuantity,
  } = yield select(getScreenshotsSettings);

  const screenshotsAllowed = yield call(isScreenshotsAllowed);
  const currentSeconds = parseInt(moment().format('ss'), 10);
  const secondsToMinutesGrid = 60 - currentSeconds;
  // second remaining to end of current Idle-minute period
  const minutes = parseInt(moment().format('mm'), 10);
  const minutePeriod = screenshotsPeriod / 60;
  const periodNumber = Math.floor(minutes / minutePeriod) + 1;
  const periodRange = (periodNumber * minutePeriod) - minutes;
  nextPeriod = (periodRange * 60) - currentSeconds;
  const initialPeriods = randomPeriods(screenshotsQuantity, 1, nextPeriod);
  yield call(infoLog, 'created initial screenshot periods', initialPeriods);
  yield put(timerActions.setScreenshotPeriods(initialPeriods));
  yield takeEvery(channel, timerStep, screenshotsAllowed, secondsToMinutesGrid);
}

function* stopTimer(channel, timerInstance) {
  try {
    yield call(ipcRenderer.send, 'stop-timer');
    channel.close();
    yield cancel(timerInstance);
    const issueId = yield select(getUiState('trackingIssueId'));
    const timeSpentInSeconds = yield select(getTimerTime);
    const comment = yield select(getWorklogComment);
    const screenshots = yield select(getScreenshots);
    const keepedIdles = yield select(getKeepedIdles);
    const idles = yield select(getIdles);
    const { screenshotsPeriod } = yield select(getScreenshotsSettings);
    const worklogType = null;
    const activity = calculateActivity({
      currentIdleList: idles.map(idle => idle.to - idle.from),
      timeSpentInSeconds,
      screenshotsPeriod,
      firstPeriodInMinute: 1,
      secondsToMinutesGrid: 1,
    });
    //
    yield put(timerActions.resetTimer());
    // yield put(worklogsActions.setTemporaryWorklogId(null));
    yield call(uploadWorklog, {
      issueId,
      comment,
      timeSpentInSeconds,
      screenshotsPeriod,
      worklogType,
      screenshots,
      activity,
      keepedIdles,
    });
  } catch (err) {
    yield call(throwError, err);
  }
}

export function* timerFlow(): Generator<*, *, *> {
  try {
    const selectedIssueId = yield select(getUiState('selectedIssueId'));
    yield put(uiActions.setUiState('trackingIssueId', selectedIssueId));
    // const tempId = Math.random().toString(36).substr(2, 9);
    // yield put(worklogsActions.setTemporaryWorklogId(tempId));
    ipcRenderer.send('start-timer');
    const channel = yield call(timerChannel);
    const timerInstance = yield fork(runTimer, channel);
    while (true) {
      yield take(actionTypes.STOP_TIMER_REQUEST);
      const time = yield select(getTimerTime);
      if (time < 60) {
        yield put(uiActions.setModalState('alert', true));
        const { type } = yield take([actionTypes.CONTINUE_TIMER, actionTypes.STOP_TIMER]);
        if (type === actionTypes.STOP_TIMER) {
          yield call(stopTimer, channel, timerInstance);
          yield cancel();
        }
      } else {
        yield call(stopTimer, channel, timerInstance);
        yield cancel();
      }
    }
  } catch (err) {
    yield call(throwError, err);
  }
}

export function* watchStartTimer(): Generator<*, *, *> {
  yield takeEvery(actionTypes.START_TIMER, timerFlow);
}


/* export function* cutIddlesFromLastScreenshot() {
  const lastScreenshotTime = yield select(getLastScreenshotTime);
  const time = yield select(getTimerTime);
  const iddles = Math.ceil((time - lastScreenshotTime) / 60);
  [>TBD wtf is this
   * yield put({
    type: types.CUT_IDDLES,
    payload: iddles,
  });<]
} */

/* function forceSave() {
  const { getGlobal } = remote;
  const { running, uploading } = getGlobal('sharedObj');

  // eslint-disable-next-line no-alert
  if (running && window.confirm('Tracking in progress, save worklog before quit?')) {
    setForceQuitFlag();
    stopTimerRequest();
  }
  if (uploading) {
    // eslint-disable-next-line no-alert
    window.alert('Currently app in process of saving worklog, wait few seconds please');
  }
}

function dismissIdleTime() {
  const seconds = Math.ceil(time / 1000);
  cutIddles(Math.ceil(seconds / 60));
  _dismissIdleTime(seconds);
}

function keepIdleTime() {
  const { getGlobal } = remote;
  const { idleDetails } = getGlobal('sharedObj');
  saveKeepedIdle(idleDetails);
  normalizeScreenshotsPeriods();
} */

let acceptScreenshotChannel;
let rejectScreenshotChannel;
let keepIdleTimeChannel;
let dismissIdleTimeChannel;

export function* watchAcceptScreenshot(): Generator<*, *, *> {
  while (true) {
    const ev = yield take(acceptScreenshotChannel);
    yield call(
      infoLog,
      'screenshot accepted',
      ev,
    );
    const running = yield select(getTimerRunning);
    if (running) {
      const { getGlobal } = remote;
      const {
        screenshotTime,
        timestamp,
        lastScreenshotPath,
        lastScreenshotThumbPath,
      } = getGlobal('sharedObj');
      yield call(uploadScreenshot, {
        screenshotTime,
        lastScreenshotPath,
        lastScreenshotThumbPath,
        timestamp,
      });
    }
  }
}

export function* watchRejectScreenshot(): Generator<*, *, *> {
  while (true) {
    const ev = yield take(rejectScreenshotChannel);
    yield call(
      infoLog,
      'screenshot rejected',
      ev,
    );
    const running = yield select(getTimerRunning);
    if (running) {
      const { getGlobal } = remote;
      const { lastScreenshotPath } = getGlobal('sharedObj');
      /* yield call(cutIddlesFromLastScreenshot); */
      yield call(rejectScreenshot, lastScreenshotPath);
    }
  }
}

export function* watchKeepIdleTime(): Generator<*, *, *> {
  while (true) {
    const ev = yield take(keepIdleTimeChannel);
    yield call(
      infoLog,
      'idle time keeped',
      ev,
    );
    const { getGlobal } = remote;
    const { idleDetails } = getGlobal('sharedObj');
    yield put(timerActions.addIdleTime(idleDetails));
    yield call(cleanExcessScreenshotPeriods);
  }
}

export function* watchDismissIdleTime(): Generator<*, *, *> {
  while (true) {
    const ev = yield take(dismissIdleTimeChannel);
    yield call(
      infoLog,
      'idle time dismissed',
      ev,
    );
    const time = ev.payload[0];
    const seconds = Math.ceil(time / 1000);
    // cutIddles(Math.ceil(seconds / 60));
    yield put(timerActions.dismissIdleTime(seconds));
  }
}

export function* createIpcListeners(): Generator<*, *, *> {
  acceptScreenshotChannel = yield call(createIpcChannel, 'screenshot-accept');
  yield fork(watchAcceptScreenshot);

  rejectScreenshotChannel = yield call(createIpcChannel, 'screenshot-reject');
  yield fork(watchRejectScreenshot);

  keepIdleTimeChannel = yield call(createIpcChannel, 'keep-idle-time');
  yield fork(watchKeepIdleTime);

  dismissIdleTimeChannel = yield call(createIpcChannel, 'dismiss-idle-time');
  yield fork(watchDismissIdleTime);

  // ipcRenderer.on('force-save', forceSave);
}
