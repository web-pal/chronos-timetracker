import { remote } from 'electron';
import { checkUpdates } from 'config';

import * as types from '../constants';

const { autoUpdater } = remote.require('electron-updater');

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

export function stopTimerRequest() {
  return {
    type: types.STOP_TIMER_REQUEST,
  };
}

export function stopTimer() {
  if (checkUpdates) {
    autoUpdater.checkForUpdates();
  }
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

export function deleteScreenshotRequest(image) {
  return {
    type: types.DELETE_SCREENSHOT_REQUEST,
    payload: image,
  };
}
