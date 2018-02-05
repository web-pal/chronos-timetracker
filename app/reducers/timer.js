// @flow
import {
  actionTypes,
} from 'actions';
import type {
  Action,
  TimerState,
} from 'types';


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

export default function timer(
  state: TimerState = initialState,
  action: Action,
) {
  switch (action.type) {
    case actionTypes.TICK:
      return {
        ...state,
        time: state.time + 1,
      };
    case actionTypes.START_TIMER:
      return {
        ...state,
        running: true,
      };
    case actionTypes.SET_IDLE_STATE:
      return {
        ...state,
        idleState: action.payload,
      };
    case actionTypes.SET_LAST_SCREENSHOT_TIME:
      return {
        ...state,
        lastScreenshotTime: action.payload,
      };
    case actionTypes.ADD_SCREENSHOT:
      return {
        ...state,
        screenshots: [
          ...state.screenshots,
        ],
        lastScreenshotTime: action.screenshotTime,
      };
    case actionTypes.SET_SCREENSHOT_PERIODS:
      return {
        ...state,
        screenshotPeriods: action.payload,
      };
    case actionTypes.ADD_IDLE_TIME:
      return {
        ...state,
        idles: [
          ...state.idles,
          action.payload,
        ],
      };
    case actionTypes.DISMISS_IDLE_TIME:
      return {
        ...state,
        time: state.time - action.payload,
      };
    case actionTypes.RESET_TIMER:
    case actionTypes.__CLEAR_ALL_REDUCERS__:
      return initialState;
    default:
      return state;
  }
}
