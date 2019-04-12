import * as actionTypes from './actionTypes';


export const takeScreenshotRequest = ({
  isTest,
  time,
}) => ({
  type: actionTypes.TAKE_SCREENSHOT_REQUEST,
  isTest,
  time,
});

export const setNotificationScreenshot = ({
  screenshot,
  isTest,
  decisionTime,
  scope,
}) => ({
  type: actionTypes.SET_NOTIFICATION_SCREENSHOT,
  screenshot,
  isTest,
  decisionTime,
  scope,
});

export const closeTestScreenshotWindow = () => ({
  type: actionTypes.TEST_SCREENSHOT_WINDOW_CLOSE,
  scope: 1,
});

export const keepScreenshot = () => ({
  type: actionTypes.KEEP_SCREENSHOT,
  scope: 1,
});

export const dismissOnlyScreenshot = () => ({
  type: actionTypes.DISMISS_ONLY_SCREENSHOT,
  scope: 1,
});

export const dismissTimeAndScreenshot = () => ({
  type: actionTypes.DISMISS_TIME_AND_SCREENSHOT,
  scope: 1,
});

export const addScreenshot = payload => ({
  type: actionTypes.ADD_SCREENSHOT,
  payload,
});
