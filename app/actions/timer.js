import * as types from '../constants';

export function tick() {
  return {
    type: types.TICK,
  };
}

export function dismissIdleTime(time) {
  return {
    type: types.DISMISS_IDLE_TIME,
    payload: time,
  };
}

export function cutIddlesFromLastScreenshot() {
  return {
    type: types.CUT_IDDLES_FROM_LAST_SCREENSHOT,
  };
}

export function cutIddles(payload) {
  return {
    type: types.CUT_IDDLES,
    payload,
  };
}

export function setForceQuitFlag() {
  return {
    type: types.SET_FORCE_QUIT_FLAG,
  };
}

export function startTimer() {
  return {
    type: types.START_TIMER,
  };
}

export function stopTimer() {
  return {
    type: types.STOP_TIMER,
  };
}
