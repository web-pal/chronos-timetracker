import { cancelled, call, take, race, put, select, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { remote, ipcRenderer } from 'electron';

import NanoTimer from 'nanotimer';
import { makeScreenshot } from 'api';
import * as types from '../constants/';
import { uploadWorklog } from './worklogs';


// TODO: Integrate it with backend(settings)
// n screenshots for n period
// Screenshots quantity
const SQ = 1;
// Screenshots period
const SP = 600;

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
  let periods = [...Array(SQ).keys()].map(() => randomInteger(60, SP)).sort(sortNumber);
  try {
    while (true) {
      const seconds = yield take(chan);
      yield put({ type: types.TICK });
      if (seconds === periods[0]) {
        yield fork(takeScreenshot);
        periods.shift();
        console.log('Need to take a screnshot');
      }
      if (seconds === SP) {
        periods = [...Array(SQ).keys()].map(() => randomInteger(60, SP)).sort(sortNumber);
      }
      console.log(`timer: ${seconds}`);
    }
  } finally {
    if (yield cancelled()) {
      chan.close();
      const issueId = yield select(state => state.issues.meta.trackingIssueId);
      const secs = yield select(state => state.timer.time);
      const timeSpentSeconds = secs >= 60 ? secs : 60;
      yield put({ type: types.SET_TIME, payload: 0 });
      yield call(
        uploadWorklog,
        { issueId, timeSpentSeconds, comment: '' },
      );
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
