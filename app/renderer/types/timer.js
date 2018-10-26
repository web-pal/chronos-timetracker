// @flow
import * as actionTypes from '../actions/actionTypes/timer';


export type TimerAction =
  {|
    type: typeof actionTypes.TICK,
  |} |
  {|
    type: typeof actionTypes.START_TIMER,
  |} |
  {|
    type: typeof actionTypes.STOP_TIMER,
  |} |
  {|
    type: typeof actionTypes.CONTINUE_TIMER,
  |} |
  {|
    type: typeof actionTypes.STOP_TIMER_REQUEST,
  |} |
  {|
    type: typeof actionTypes.SET_IDLE_STATE,
    payload: any,
  |} |
  {|
    type: typeof actionTypes.SET_LAST_SCREENSHOT_TIME,
    payload: any,
  |} |
  {|
    type: typeof actionTypes.RESET_TIMER,
  |} |
  {|
    type: typeof actionTypes.ADD_SCREENSHOT,
    screenshot: any,
    screenshotTime: number,
  |} |
  {|
    type: typeof actionTypes.SET_SCREENSHOT_PERIODS,
    payload: Array<number>,
  |} |
  {|
    type: typeof actionTypes.ADD_IDLE_TIME,
    payload: any,
  |} |
  {|
    type: typeof actionTypes.DISMISS_IDLE_TIME,
    payload: number,
  |};

export type TimerState = {|
  time: number,
  running: boolean,
  idleState: boolean,
  lastScreenshotTime: number,
  idles: Array<any>,
  keepedIdles: Array<any>,
  screenshotPeriods: Array<any>,
  screenshots: Array<any>,
|};
