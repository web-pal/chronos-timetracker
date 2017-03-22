import * as types from '../constants/timer';

const InitialState = Immutable.Record({
  time: 0,
  running: false,
  uploading: false,
  lastScreenshotTime: null,
  currentScreenShotsList: Immutable.List(),

  paused: false,
  currentWorklogId: null,
  trackingIssue: null,
  description: '',
  jiraWorklogId: null,
  activity: Immutable.List(),
});

const initialState = new InitialState();

export default function timer(state = initialState, action) {
  switch (action.type) {
    case types.START_TIMER:
      return state.set('running', true);
    case types.STOP_TIMER:
      return state.set('running', false);

    case types.TICK:
      return state.set('time', state.time + 1);
    case types.SET_TIME:
      return state.set('time', action.payload);
    case types.SET_LAST_SCREENSHOT_TIME:
      return state.set('lastScreenshotTime', action.payload);
    case types.SET_WORKLOG_UPLOAD_STATE:
      return state.set('uploading', action.payload);

    case types.REJECT_SCREENSHOT:
      return state.set('time', state.lastScreenshotTime);

    case types.ADD_SCREENSHOT_TO_CURRENT_LIST:
      return state.update(
        'currentScreenShotsList',
        list => list.push(action.payload),
      );
    case types.CLEAR_CURRENT_SCREENSHOTS_LIST:
      return state.set('currentScreenShotsList', Immutable.List());


    case types.START: {
      if (state.paused) {
        return state.set('paused', false);
      }
      return state
        .set('running', true)
        .set('currentWorklogId', action.worklogId)
        .set('trackingIssue', action.issueId);
    }
    case types.SET_DESCRIPTION:
      return state.set('description', action.payload);
    case types.STOP:
      return state.set('running', false);
    case types.RESET:
      return initialState;
    case types.PAUSE:
      return state.set('paused', true);
    case types.UNPAUSE:
      return state.delete('paused');
    case types.SET_JIRA_WORKLOG_ID:
      return state.set('jiraWorklogId', action.id);
    case types.DISMISS_IDLE_TIME:
      return state.set('time', state.time - action.payload);
    case types.ADD_ACTIVITY_PERCENT:
      return state.set('activity', state.activity.push(action.payload));
    default:
      return state;
  }
}
