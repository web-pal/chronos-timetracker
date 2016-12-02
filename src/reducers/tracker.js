import * as types from '../constants/tracker';

const InitialState = Immutable.Record({
  time: 0,
  running: false,
  paused: false,
  currentWorklogId: null,
  lastScreenshotTime: null,
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
      return state.set('running', true).set('currentWorklogId', action.worklogId);
    }
    case types.STOP:
      return initialState;
    case types.PAUSE:
      return state.set('paused', true);
    case types.REJECT_SCREENSHOT:
      return state.set('time', state.lastScreenshotTime);
    case types.ACCEPT_SCREENSHOT:
      return state.set('lastScreenshotTime', action.screenshotTime);
    default:
      return state;
  }
}
