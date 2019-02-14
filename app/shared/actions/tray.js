import {
  actionTypes,
} from '.';


export const trayStartTimer = () => ({
  type: actionTypes.TRAY_START_TIMER,
  scope: ['main'],
});

export const trayStopTimer = () => ({
  type: actionTypes.TRAY_STOP_TIMER,
  scope: ['main'],
});

export const traySelectIssue = issueKey => ({
  type: actionTypes.TRAY_SELECT_ISSUE,
  scope: ['main'],
  issueKey,
});
