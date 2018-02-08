// @flow
import * as actionTypes from '../actions/actionTypes/worklogs';
import type {
  Id,
  User,
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

export type Worklog = {|
  __type: 'group' | 'single',
  self: string,
  author: User,
  updateAuthor: User,
  comment: string | null,
  created: string,
  updated: string,
  started: string,
  timeSpent: string,
  timeSpentSeconds: number,
  id: string,
  issueId: string,
  worklogsCount?: number,
  worklogs?: Array<Worklog>,
|};

export type WorklogsResources = {
  [Id]: Worklog,
}
