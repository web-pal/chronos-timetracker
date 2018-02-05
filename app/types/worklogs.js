// @flow
import * as actionTypes from '../actions/actionTypes/worklogs';
import type {
  Id,
} from './';


export type WorklogsAction =
  {|
    type: typeof actionTypes.SAVE_WORKLOG_REQUEST,
    payload: any,
  |} |
  {|
    type: typeof actionTypes.DELETE_WORKLOG_REQUEST,
    worklogId: Id,
  |};

export type Worklog = any;

export type WorklogsResources = {
  [Id]: Worklog,
}
