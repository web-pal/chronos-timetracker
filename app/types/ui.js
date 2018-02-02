// @flow
import * as actionTypes from '../actions/actionTypes/ui';
import type {
  Id,
} from './';


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
    id: Id,
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

export type UiState = {|
  initializeInProcess: boolean,
  authorized: boolean,
  authFormStep: number,
  loginError: null | string,
  loginRequestInProcess: boolean,
  host: null | string,
  protocol: null | string,
  isPaidUser: boolean,

  updateCheckRunning: boolean,
  updateFetching: boolean,
  updateAvailable: null | string,

  sidebarType: 'all' | 'recent',
  issueViewTab: 'Details' | 'Comments' | 'Worklogs' | 'Report',
  issueViewWorklogsScrollToIndex: number,
  issuesSearch: string,
  issuesFilters: {
    type: Array<string>,
    status: Array<string>,
    assignee: Array<string>,
  },

  selectedWorklogId: Id | null,
  deleteWorklogId: Id | null,
  editWorklogId: Id | null,
  worklogFormIssueId: Id | null,

  selectedIssueId: Id | null,
  issuesSourceType: string | null,
  issuesSourceId: Id |null,
  issuesSprintId: Id | null,

  screenshotsAllowed: boolean,
  sidebarFiltersIsOpen: boolean,
  filterStatusesIsFetched: boolean,
  commentAdding: boolean,

  modalState: {|
    settings: boolean,
    support: boolean,
    about: boolean,
    alert: boolean,
    worklog: boolean,
    confirmDeleteWorklog: boolean,
    editWorklog: boolean,
  |},

  flags: Array<any>,
|};
