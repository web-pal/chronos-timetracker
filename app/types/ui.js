// @flow
import * as actionTypes from '../actions/actionTypes/ui';


export type UiAction =
  {|
    type: typeof actionTypes.SET_UI_STATE,
    payload: {|
      key: string,
      value: any,
    |},
  |} |
  {|
    type: typeof actionTypes.SET_MODAL_STATE,
    payload: {|
      modalName: string,
      state: boolean,
    |},
  |} |
  {|
    type: typeof actionTypes.ISSUE_WORKLOGS_SCROLL_TO_INDEX_REQUEST,
    worklogId: number | string,
    issueId: number | string,
  |} |
  {|
    type: typeof actionTypes.ADD_FLAG,
    payload: any,
  |} |
  {|
    type: typeof actionTypes.DELETE_FLAG,
    id: number,
  |} |
  {|
    type: typeof actionTypes.SET_ISSUES_FILTER,
    filterType: string,
    value: Array<string>,
  |} |
  {|
    type: typeof actionTypes.CHECK_FOR_UPDATES_REQUEST,
  |} |
  {|
    type: typeof actionTypes.INSTALL_UPDATE_REQUEST,
  |};
