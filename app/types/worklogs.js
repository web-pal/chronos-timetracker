// @flow
import { types } from 'actions';

import type { Id } from './index';

export type ManualWorklogData = {
  date: mixed,
  startTime: mixed,
  endTime: mixed,
  comment: string | null,
};

// TODO type for worklog
export type Worklog = any;

export type WorklogsMap = { [Id]: Worklog };

export type WorklogsMeta = {|
  +fetching: boolean,
  +worklogComment: string,
  +selectedWorklogId: Id | null,
  +temporaryWorklogId: Id | null,
|};

//
export type FillWorklogsAction =
  {| type: typeof types.FILL_WORKLOGS, payload: { ids: Array<Id>, map: WorklogsMap }|};

export type FillWorklogs = {
  (payload: { ids: Array<Id>, map: WorklogsMap }): FillWorklogsAction
};

//
export type AddWorklogsAction =
  {| type: typeof types.ADD_WORKLOGS, payload: { ids: Array<Id>, map: WorklogsMap } |};

export type AddWorklogs = {
  (payload: { ids: Array<Id>, map: WorklogsMap }): AddWorklogsAction
};

//
export type ClearWorklogsAction =
  {| type: typeof types.CLEAR_WORKLOGS |};

export type ClearWorklogs = {
  (): ClearWorklogsAction
};

//
export type FillRecentWorklogIdsAction =
  {| type: typeof types.FILL_RECENT_WORKLOG_IDS, payload: Array<Id> |};

export type FillRecentWorklogIds = {
  (payload: Array<Id>): FillRecentWorklogIdsAction
};

//
export type AddRecentWorklogIdsAction =
  {| type: typeof types.ADD_RECENT_WORKLOG_IDS, payload: Array<Id> |};

export type AddRecentWorklogIds = {
  (payload: Array<Id>): AddRecentWorklogIdsAction
};

//
export type SetWorklogsFetchingAction =
  {| type: typeof types.SET_WORKLOGS_FETCHING, payload: boolean |};

export type SetWorklogsFetching = {
  (payload: boolean): SetWorklogsFetchingAction
};

//
export type SetWorklogCommentAction =
  {| type: typeof types.SET_WORKLOG_COMMENT, payload: string |};

export type SetWorklogComment = {
  (payload: string): SetWorklogCommentAction
};

//
export type SelectWorklogAction =
  {| type: typeof types.SELECT_WORKLOG, payload: Id |};

export type SelectWorklog = {
  (payload: Id): SelectWorklogAction
};

//
export type SetTemporaryWorklogIdAction =
  {| type: typeof types.SET_TEMPORARY_WORKLOG_ID, payload: Id |};

export type SetTemporaryWorklogId = {
  (payload: Id): SetTemporaryWorklogIdAction
};

//
export type AddManualWorklogRequestAction =
  {| type: typeof types.ADD_MANUAL_WORKLOG_REQUEST, payload: ManualWorklogData |};

export type AddManualWorklogRequest = {
  (payload: ManualWorklogData): AddManualWorklogRequestAction
};

export type WorklogAction =
  FillWorklogsAction
  | AddWorklogsAction
  | ClearWorklogsAction
  | FillRecentWorklogIdsAction
  | AddRecentWorklogIdsAction
  | SetWorklogsFetchingAction
  | SetWorklogCommentAction
  | SelectWorklogAction
  | SetTemporaryWorklogIdAction;
