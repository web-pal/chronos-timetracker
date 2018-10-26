// @flow
import type {
  Id,
  UiAction,
} from 'types';

import * as actionTypes from './actionTypes';


export const setUiState = (
  key: string,
  value: any,
  scope: string,
): UiAction => ({
  type: actionTypes.SET_UI_STATE,
  payload: {
    key,
    value,
  },
  scope,
});

export const resetUiState = (
  keys: Array<string>,
): UiAction => ({
  type: actionTypes.RESET_UI_STATE,
  payload: {
    keys,
  },
});

export const setModalState = (
  modalName: string,
  state: boolean,
): UiAction => ({
  type: actionTypes.SET_MODAL_STATE,
  payload: {
    modalName,
    state,
  },
});

export const setIssuesFilters = (
  filterType: string,
  value: Array<string | boolean>,
): UiAction => ({
  type: actionTypes.SET_ISSUES_FILTER,
  filterType,
  value,
});

export const addFlag = (
  payload: any,
): UiAction => ({
  type: actionTypes.ADD_FLAG,
  payload,
});

export const deleteFlag = (
  id: Id,
): UiAction => ({
  type: actionTypes.DELETE_FLAG,
  id,
});

export const checkForUpdatesRequest = (): UiAction => ({
  type: actionTypes.CHECK_FOR_UPDATES_REQUEST,
});

export const installUpdateRequest = (): UiAction => ({
  type: actionTypes.INSTALL_UPDATE_REQUEST,
});

export const issueWorklogsScrollToIndexRequest = (
  worklogId: number | string,
  issueId: number | string,
): UiAction => ({
  type: actionTypes.ISSUE_WORKLOGS_SCROLL_TO_INDEX_REQUEST,
  worklogId,
  issueId,
});

export const acknowlegdeFeature = (payload: {
  featureId: string,
}): UiAction => ({
  type: actionTypes.ACKNOWLEDGE_FEATURE,
  payload,
});
