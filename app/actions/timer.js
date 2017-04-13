import { remote } from 'electron';
import * as types from '../constants';

const Updater = remote.require('electron-simple-updater');

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

export function saveKeepedIdle(payload) {
  return {
    type: types.SAVE_KEEP_IDLE,
    payload,
  };
}

export function normalizeScreenshotsPeriods() {
  return {
    type: types.NORMALIZE_SCREENSHOTS_PERIODS,
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

export function setForceQuitFlag(callback = true) {
  return {
    type: types.SET_FORCE_QUIT_FLAG,
    payload: callback,
  };
}

export function startTimer() {
  return {
    type: types.START_TIMER,
  };
}

export function stopTimer() {
  Updater.checkForUpdates();
  return {
    type: types.STOP_TIMER,
  };
}

export function savePeriods(periods) {
  return {
    type: types.SET_PERIODS,
    payload: periods,
  };
}
