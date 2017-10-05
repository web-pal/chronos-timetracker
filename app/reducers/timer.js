// @flow
import { types } from 'actions';
import type { TimerState, Action } from '../types';

const initialState: TimerState = {
  time: 0,
  running: false,
  idleState: false,
  lastScreenshotTime: 0,
  idles: [],
  keepedIdles: [],
  screenshotPeriods: [],
};

export default function timer(state: TimerState = initialState, action: Action) {
  switch (action.type) {
    case types.TICK:
      return {
        ...state,
        time: state.time + 1,
      };
    case types.START_TIMER:
      return {
        ...state,
        running: true,
      };
    case types.STOP_TIMER:
      return {
        ...state,
        running: false,
      };
    case types.SET_IDLE_STATE:
      return {
        ...state,
        idleState: action.payload,
      };
    case types.SET_LAST_SCREENSHOT_TIME:
      return {
        ...state,
        lastScreenshotTime: action.payload,
      };
    case types.___CLEAR_ALL_REDUCERS___:
      return initialState;
    default:
      return state;
  }
}
