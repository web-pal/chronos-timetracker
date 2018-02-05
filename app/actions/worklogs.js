// @flow
import type {
  Id,
  WorklogsAction,
} from 'types';

import * as actionTypes from './actionTypes';


export const saveWorklogRequest = (
  payload: any,
): WorklogsAction => ({
  type: actionTypes.SAVE_WORKLOG_REQUEST,
  payload,
});

export const deleteWorklogRequest = (
  worklogId: Id,
): WorklogsAction => ({
  type: actionTypes.DELETE_WORKLOG_REQUEST,
  worklogId,
});
