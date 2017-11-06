// @flow
import type { ClearAllReducers, ClearAllReducersAction } from '../types';
import { ___CLEAR_ALL_REDUCERS___ } from './actionTypes/';

export * as profileActions from './profile';
export * as uiActions from './ui';
export * as settingsActions from './settings';
export * as projectsActions from './projects';
export * as issuesActions from './issues';
export * as timerActions from './timer';
export * as worklogsActions from './worklogs';

export * as types from './actionTypes/';

// eslint-disable-next-line import/prefer-default-export
export const clearAllReducers: ClearAllReducers = (): ClearAllReducersAction => ({
  type: ___CLEAR_ALL_REDUCERS___,
});
