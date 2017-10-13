// @flow
import type {
  TimerState,
} from '../types';

export const getTimerTime =
  ({ timer }: { timer: TimerState }): number => timer.time;

export const getTimerRunning =
  ({ timer }: { timer: TimerState }): boolean => timer.running;

export const getTimerIdleState =
  ({ timer }: { timer: TimerState }): boolean => timer.idleState;

export const getLastScreenshotTime =
  ({ timer }: { timer: TimerState }): number => timer.lastScreenshotTime;

export const getScreenshotPeriods =
  ({ timer }: { timer: TimerState }): Array<number> => timer.screenshotPeriods;

export const getScreenshots =
  ({ timer }: { timer: TimerState }): Array<any> => timer.screenshots;

export const getIdles =
  ({ timer }: { timer: TimerState }): Array<any> => timer.idles;
