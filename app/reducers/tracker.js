import * as types from '../constants/tracker';

const InitialState = Immutable.Record({
  time: 0,
  running: false,
  paused: false,
  currentWorklogId: null,
  trackingIssue: null,
  lastScreenshotTime: null,
  description: null,
  jiraWorklogId: null,
  uploading: false,
  screensShot: Immutable.List(),
});

const initialState = new InitialState();

export default function tracker(state = initialState, action) {
  switch (action.type) {
    case types.TICK:
      return state.set('time', state.time + 1);
    case types.START: {
      if (state.paused) {
        return state.set('paused', false);
      }
      return state
        .set('running', true)
        .set('currentWorklogId', action.worklogId)
        .set('trackingIssue', action.issueId)
        .set('description', action.description);
    }
    case types.STOP:
      return state.set('running', false);
    case types.RESET:
      return initialState;
    case types.PAUSE:
      return state.set('paused', true);
    case types.UNPAUSE:
      return state.delete('paused');
    case types.REJECT_SCREENSHOT:
      return state.set('time', state.lastScreenshotTime);
    case types.ACCEPT_SCREENSHOT:
      return state.set('lastScreenshotTime', action.screenshotTime)
                  .set('screensShot', state.screensShot.push({ name: action.screenshotName }));
    case types.SET_JIRA_WORKLOG_ID:
      return state.set('jiraWorklogId', action.id);
    case types.DISMISS_IDLE_TIME:
      return state.set('time', state.time - action.payload);
    case types.SET_WORKLOG_UPLOAD_STATE:
      return state.set('uploading', action.payload);
    default:
      return state;
  }
}
