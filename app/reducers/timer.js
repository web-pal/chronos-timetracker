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
  screenshots: [],
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
    case types.ADD_SCREENSHOT:
      return {
        ...state,
        screenshots: [
          ...state.screenshots,
          action.payload,
        ],
        lastScreenshotTime: action.meta,
      };
    case types.SET_SCREENSHOT_PERIODS:
      return {
        ...state,
        screenshotPeriods: action.payload,
      };
    case types.ADD_IDLE_TIME:
      return {
        ...state,
        idles: [
          ...state.idles,
          action.payload,
        ],
      };
    case types.RESET_TIMER:
    case types.___CLEAR_ALL_REDUCERS___:
      return initialState;
    default:
      return state;
  }
}
