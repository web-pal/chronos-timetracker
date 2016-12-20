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
      return initialState;
    case types.PAUSE:
      return state.set('paused', true);
    case types.UNPAUSE:
      return state.delete('paused');
    case types.REJECT_SCREENSHOT:
      return state.set('time', state.lastScreenshotTime);
    case types.ACCEPT_SCREENSHOT:
      return state.set('lastScreenshotTime', action.screenshotTime);
    case types.SET_JIRA_WORKLOG_ID:
      return state.set('jiraWorklogId', action.id);
    default:
      return state;
  }
}
