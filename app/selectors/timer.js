// @flow
import type {
  TimerState,
} from 'types';

export const getTimerState = (key: string) =>
  ({
    timer,
  }: {
    timer: TimerState,
  }) => timer[key];
