import { remote } from 'electron';
import storage from 'electron-json-storage';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { staticUrl } from 'config';

import * as types from '../constants';
import { success, fail } from '../helpers/promise';

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

export function startTimerr(trackingIssue) {
  return (dispatch, getState) => {
    // Temporary worklog ID
    const worklogId = Date.now();
    const currentIssueId = trackingIssue || getState().issues.meta.selected;
    const currentIssue =
      getState().issues.byId.get(currentIssueId) ||
      getState().issues.recentById.get(currentIssueId);
    dispatch({
      type: types.START,
      worklogId,
      issueId: currentIssueId,
    });
    dispatch({
      type: types.SET_TRACKING_ISSUE,
      payload: currentIssueId,
    });
    dispatch({
      type: types.ADD_RECENT_ISSUE,
      payload: {
        id: currentIssueId,
        issue: currentIssue,
      },
    });
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

export function pauseTimer() {
  return {
    type: types.PAUSE,
  };
}

export function unpauseTimer() {
  return {
    type: types.UNPAUSE,
  };
}

export function resetTimer() {
  return {
    type: types.RESET,
  };
}


export function addActivityPercent(percent) {
  return {
    type: types.ADD_ACTIVITY_PERCENT,
    payload: percent,
  };
}

export function setDescription(description) {
  return {
    type: types.SET_DESCRIPTION,
    payload: description
  }
}
