// @flow
import * as types from './actionTypes';
import type {
  Tick, TickAction,
  StartTimer, StartTimerAction,
  StopTimer, StopTimerAction,
  SetIdleState, SetIdleStateAction,
  SetLastScreenshotTime, SetLastScreenshotTimeAction,
} from '../types';

export const tick: Tick = (): TickAction => ({ type: types.TICK });
export const startTimer: StartTimer = (): StartTimerAction => ({ type: types.START_TIMER });
export const stopTimer: StopTimer = (): StopTimerAction => ({ type: types.STOP_TIMER });

export const setIdleState: SetIdleState = (
  payload: boolean,
): SetIdleStateAction => ({
  type: types.SET_IDLE_STATE,
  payload,
});

export const setLastScreenshotTime: SetLastScreenshotTime = (
  payload: number,
): SetLastScreenshotTimeAction => ({
  type: types.SET_LAST_SCREENSHOT_TIME,
  payload,
});
