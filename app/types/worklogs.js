// @flow
import { types } from 'actions';

import type { Id } from './index';
import type { User } from './profile';

export type ManualWorklogData = {
  date: mixed,
  startTime: mixed,
  comment: string | null,
  totalSpent: string,
};

// TODO type for worklog
export type Worklog = {
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
};

export type WorklogsMap = { [Id]: Worklog };

export type WorklogsMeta = {|
  +fetching: boolean,
  +editWorklogFetching: boolean,
  +worklogComment: string,
  +selectedWorklogId: Id | null,
  +temporaryWorklogId: Id | null,
  +editingWorklog: Worklog | null,
|};

export type WorklogsState = {|
  allIds: Array<Id>,
  byId: WorklogsMap,
  recentWorklogIds: Array<Id>,
  meta: WorklogsMeta,
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
export type SetEditWorklogFetchingAction =
  {| type: typeof types.SET_ADD_WORKLOG_FETCHING, payload: boolean |};

export type SetEditWorklogFetching = {
  (payload: boolean): SetEditWorklogFetchingAction
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

//
export type DeleteWorklogRequestAction =
  {| type: typeof types.DELETE_WORKLOG_REQUEST, payload: Worklog |};

export type DeleteWorklogRequest = {
  (payload: Worklog): DeleteWorklogRequestAction
};

//
export type EditWorklogRequestAction =
  {| type: typeof types.EDIT_WORKLOG_REQUEST, payload: Worklog |};

export type EditWorklogRequest = {
  (payload: Worklog): EditWorklogRequestAction
};

//
export type SetEditingWorklogAction =
  {| type: typeof types.SET_EDITING_WORKLOG, payload: Worklog | null |};

export type SetEditingWorklog = {
  (payload: Worklog | null): SetEditingWorklogAction
};

//
export type ConfirmEditWorklogAction =
  {| type: typeof types.CONFIRM_EDIT_WORKLOG, payload: Worklog |};

export type ConfirmEditWorklog = {
  (payload: Worklog): ConfirmEditWorklogAction
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
