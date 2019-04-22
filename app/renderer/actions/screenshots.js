import * as actionTypes from './actionTypes';


export const takeScreenshotRequest = ({
  isTest,
  time,
  timestamp,
}) => ({
  type: actionTypes.TAKE_SCREENSHOT_REQUEST,
  isTest,
  time,
  timestamp,
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

export const takeScreenshotFinished = () => ({
  type: actionTypes.TAKE_SCREENSHOT_FINISHED,
});

export const uploadScreenshotFinished = () => ({
  type: actionTypes.UPLOAD_SCREENSHOT_FINISHED,
});

export const nativeScreenshotNotificationClick = () => ({
  type: actionTypes.NATIVE_SCREENSHOT_NOTIFICATION_CLICK,
});

export const showScreenshotsViewerWindow = ({
  issueId,
  worklogId,
} = {
  issueId: null,
  worklogId: null,
}) => ({
  type: actionTypes.SHOW_SCREENSHOTS_VIEWER_WINDOW,
  issueId,
  worklogId,
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

export const addScreenshot = (
  payload,
  screenshotViewerWindowId,
) => ({
  type: actionTypes.ADD_SCREENSHOT,
  payload,
  scope: [
    1,
    screenshotViewerWindowId,
  ],
});

export const deleteScreenshotRequest = ({
  timestamp,
  issueId,
  worklogId,
  isUnfinished,
}) => ({
  type: actionTypes.DELETE_SCREENSHOT_REQUEST,
  timestamp,
  issueId,
  worklogId,
  isUnfinished,
  scope: [1],
});

export const deleteScreenshot = ({
  timestamp,
  issueId,
  worklogId,
  screenshotViewerWindowId,
}) => ({
  type: actionTypes.DELETE_SCREENSHOT,
  timestamp,
  issueId,
  worklogId,
  scope: [screenshotViewerWindowId],
});

export const setScreenshots = (
  payload,
  screenshotViewerWindowId,
  onlyToViewer,
) => ({
  type: actionTypes.SET_SCREENSHOTS,
  payload,
  scope: [
    ...(
      onlyToViewer
        ? []
        : [1]
    ),
    screenshotViewerWindowId,
  ],
});

export const setScreenshotsViewerState = (
  payload,
  scope,
) => ({
  type: actionTypes.SET_SCREENSHOTS_VIEWER_STATE,
  payload,
  scope,
});
