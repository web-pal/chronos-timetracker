// @flow
import { types } from 'actions';

// TODO type for idle
export type Idle = any;

export type TimerState = {|
  +time: number,
  +running: boolean,
  +idleState: boolean,
  +lastScreenshotTime: number,
  +idles: Array<Idle>,
  +keepedIdles: Array<Idle>,
  +screenshotPeriods: Array<number>,
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

export type TimerAction =
  TickAction
  | StartTimerAction
  | StopTimerAction
  | SetIdleStateAction
  | SetLastScreenshotTimeAction;
