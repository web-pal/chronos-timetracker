import * as types from '../constants/tracker';

export function tick() {
  return {
    type: types.TICK,
  };
}

export function startTimer() {
  return {
    type: types.START,
  };
}

export function pauseTimer() {
  return {
    type: types.PAUSE,
  };
}

export function stopTimer() {
  return {
    type: types.STOP,
  };
}
