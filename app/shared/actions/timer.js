import {
  actionTypes,
} from '.';

export const startTimer = () => ({
  type: actionTypes.START_TIMER,
  scope: ['mainRenderer'],
});

export const stopTimerRequest = () => ({
  type: actionTypes.STOP_TIMER_REQUEST,
  scope: ['mainRenderer'],
});
