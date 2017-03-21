import { cancelled, call, take, race, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import NanoTimer from 'nanotimer';
import * as types from '../constants/';


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
  try {
    while (true) {
      const seconds = yield take(chan);
      yield put({ type: types.SET_TIME, payload: seconds });
      console.log(`timer: ${seconds}`);
    }
  } finally {
    if (yield cancelled()) {
      chan.close();
      yield put({ type: types.SET_TIME, payload: 0 });
      console.log('timer cancelled');
    }
  }
}

export function* manageTimer() {
  while (true) {
    yield take(types.START_TIMER);
    yield race({
      start: call(runTimer),
      stoped: take(types.STOP_TIMER),
    });
  }
}
