// @flow
import * as types from './actionTypes';
import type {
  FillWorklogs, FillWorklogsAction,
  AddWorklogs, AddWorklogsAction,
  ClearWorklogs, ClearWorklogsAction,
  FillRecentWorklogIds, FillRecentWorklogIdsAction,
  AddRecentWorklogIds, AddRecentWorklogIdsAction,
  SetWorklogsFetching, SetWorklogsFetchingAction,
  SetEditWorklogFetching, SetEditWorklogFetchingAction,
  SetWorklogComment, SetWorklogCommentAction,
  SelectWorklog, SelectWorklogAction,
  SetTemporaryWorklogId, SetTemporaryWorklogIdAction,
  AddManualWorklogRequest, AddManualWorklogRequestAction,
  DeleteWorklogRequest, DeleteWorklogRequestAction,
  EditWorklogRequest, EditWorklogRequestAction,
  SetEditingWorklog, SetEditingWorklogAction,
  ConfirmEditWorklog, ConfirmEditWorklogAction,
  Id, WorklogsMap, ManualWorklogData, Worklog,
} from '../types';

export const fillWorklogs: FillWorklogs = (
  payload: { ids: Array<Id>, map: WorklogsMap },
): FillWorklogsAction => ({
  type: types.FILL_WORKLOGS,
  payload,
});

export const addWorklogs: AddWorklogs = (
  payload: { ids: Array<Id>, map: WorklogsMap },
): AddWorklogsAction => ({
  type: types.ADD_WORKLOGS,
  payload,
});

export const clearWorklogs: ClearWorklogs =
  (): ClearWorklogsAction => ({ type: types.CLEAR_WORKLOGS });

export const fillRecentWorklogIds: FillRecentWorklogIds = (
  payload: Array<Id>,
): FillRecentWorklogIdsAction => ({
  type: types.FILL_RECENT_WORKLOG_IDS,
  payload,
});

export const addRecentWorklogIds: AddRecentWorklogIds = (
  payload: Array<Id>,
): AddRecentWorklogIdsAction => ({
  type: types.ADD_RECENT_WORKLOG_IDS,
  payload,
});

export const setWorklogsFetching: SetWorklogsFetching = (
  payload: boolean,
): SetWorklogsFetchingAction => ({
  type: types.SET_WORKLOGS_FETCHING,
  payload,
});

export const setEditWorklogFetching: SetEditWorklogFetching = (
  payload: boolean,
): SetEditWorklogFetchingAction => ({
  type: types.SET_ADD_WORKLOG_FETCHING,
  payload,
});

export const setWorklogComment: SetWorklogComment = (
  payload: string,
): SetWorklogCommentAction => ({
  type: types.SET_WORKLOG_COMMENT,
  payload,
});

export const selectWorklog: SelectWorklog = (
  payload: Id,
): SelectWorklogAction => ({
  type: types.SELECT_WORKLOG,
  payload,
});

export const setTemporaryWorklogId: SetTemporaryWorklogId = (
  payload: Id,
): SetTemporaryWorklogIdAction => ({
  type: types.SET_TEMPORARY_WORKLOG_ID,
  payload,
});

export const addManualWorklogRequest: AddManualWorklogRequest = (
  payload: ManualWorklogData,
): AddManualWorklogRequestAction => ({
  type: types.ADD_MANUAL_WORKLOG_REQUEST,
  payload,
});

export const deleteWorklogRequest: DeleteWorklogRequest = (
  payload: Worklog,
): DeleteWorklogRequestAction => ({
  type: types.DELETE_WORKLOG_REQUEST,
  payload,
});

export const editWorklogRequest: EditWorklogRequest = (
  payload: Worklog,
): EditWorklogRequestAction => ({
  type: types.EDIT_WORKLOG_REQUEST,
  payload,
});

export const setEditingWorklog: SetEditingWorklog = (
  payload: Worklog | null,
): SetEditingWorklogAction => ({
  type: types.SET_EDITING_WORKLOG,
  payload,
});

export const confirmEditWorklog: ConfirmEditWorklog = (
  payload: Worklog,
): ConfirmEditWorklogAction => ({
  type: types.CONFIRM_EDIT_WORKLOG,
  payload,
});
