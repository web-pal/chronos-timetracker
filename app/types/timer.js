// @flow
import { types } from 'actions';

// TODO type for idle
export type Idle = {
  from: number,
  to: number,
};

export type Screenshot = any;

export type TimerState = {|
  +time: number,
  +running: boolean,
  +idleState: boolean,
  +lastScreenshotTime: number,
  +idles: Array<Idle>,
  +keepedIdles: Array<Idle>,
  +screenshotPeriods: Array<number>,
  +screenshots: Array<Screenshot>,
|};

//
export type TickAction =
  {| type: typeof types.TICK |};

export type Tick = {
  (): TickAction
};

//
export type StartTimerAction =
  {| type: typeof types.START_TIMER |};

export type StartTimer = {
  (): StartTimerAction
};

//
export type StopTimerRequestAction =
  {| type: typeof types.STOP_TIMER_REQUEST |};

export type StopTimerRequest = {
  (): StopTimerRequestAction
};

//
export type StopTimerAction =
  {| type: typeof types.STOP_TIMER |};

export type StopTimer = {
  (): StopTimerAction
};

//
export type SetIdleStateAction =
  {| type: typeof types.SET_IDLE_STATE, +payload: boolean |};

export type SetIdleState = {
  (payload: boolean): SetIdleStateAction
};

//
export type SetLastScreenshotTimeAction =
  {| type: typeof types.SET_LAST_SCREENSHOT_TIME, +payload: number |};

export type SetLastScreenshotTime = {
  (payload: number): SetLastScreenshotTimeAction
};

//
export type ResetTimerAction =
  {| type: typeof types.RESET_TIMER |};

export type ResetTimer = {
  (): ResetTimerAction
};

//
export type AddScreenshotAction =
  {| type: typeof types.ADD_SCREENSHOT, +payload: Screenshot, +meta: number |};

export type AddScreenshot = {
  (screenshot: Screenshot, screenshotTime: number): AddScreenshotAction
};

//
export type SetScreenshotPeriodsAction =
  {| type: typeof types.SET_SCREENSHOT_PERIODS, +payload: Array<number> |};

export type SetScreenshotPeriods = {
  (payload: Array<number>): SetScreenshotPeriodsAction
};

//
export type AddIdleTimeAction =
  {| type: typeof types.ADD_IDLE_TIME, +payload: Idle |};

export type AddIdleTime = {
  (payload: Idle): AddIdleTimeAction
};

export type TimerAction =
  TickAction
  | StartTimerAction
  | StopTimerAction
  | SetIdleStateAction
  | SetLastScreenshotTimeAction
  | ResetTimerAction
  | AddScreenshotAction
  | SetScreenshotPeriodsAction
  | AddIdleTimeAction;
