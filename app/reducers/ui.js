// @flow
import {
  types,
} from 'actions';
import type {
  Action,
  UiState,
} from '../types';


const initialState: UiState = {
  initializeInProcess: false,
  authorized: false,
  authFormStep: 1,
  loginError: null,
  loginRequestInProcess: false,
  host: null,
  protocol: null,
  isPaidUser: false,

  updateCheckRunning: false,
  updateFetching: false,
  updateAvailable: null,

  sidebarType: 'all',
  issueViewTab: 'Details',
  issueViewWorklogsScrollToIndex: 0,
  issuesSearch: '',
  issuesFilters: {
    type: [],
    status: [],
    assignee: [],
  },

  selectedWorklogId: null,
  deleteWorklogId: null,
  editWorklogId: null,
  worklogFormIssueId: null,

  selectedIssueId: null,
  issuesSourceType: null,
  issuesSourceId: null,
  issuesSprintId: null,

  screenshotsAllowed: false,
  sidebarFiltersIsOpen: false,
  filterStatusesIsFetched: false,
  commentAdding: false,

  modalState: {
    settings: false,
    support: false,
    about: false,
    alert: false,
    worklog: false,
    confirmDeleteWorklog: false,
    editWorklog: false,
  },

  flags: [],
};

export default function ui(state: UiState = initialState, action: Action) {
  switch (action.type) {
    case types.SET_UI_STATE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case types.SET_MODAL_STATE:
      return {
        ...state,
        modalState: {
          ...state.modalState,
          [action.payload.modalName]: action.payload.state,
        },
      };
    case types.SET_INITIALIZE_PROCESS:
      return {
        ...state,
        initializeInProcess: action.payload,
      };
    case types.SET_AUTH_FORM_STEP:
      return {
        ...state,
        authFormStep: action.payload,
      };
    case types.SET_SIDEBAR_TYPE:
      return {
        ...state,
        sidebarType: action.payload,
      };
    case types.SET_ISSUE_VIEW_TAB:
      return {
        ...state,
        issueViewTab: action.payload,
      };
    case types.SET_UPDATE_CHECK_RUNNING:
      return {
        ...state,
        updateCheckRunning: action.payload,
      };
    case types.SET_UPDATE_AVAILABLE:
      return {
        ...state,
        updateAvailable: action.payload,
      };
    case types.SET_UPDATE_FETCHING:
      return {
        ...state,
        updateFetching: action.payload,
      };
    case types.SET_ISSUES_FILTER:
      return {
        ...state,
        issuesFilters: {
          ...state.issuesFilters,
          [action.filterType]: action.value,
        },
      };
    case types.SET_SETTINGS_MODAL_OPEN:
      return {
        ...state,
        settingsModalOpen: action.payload,
      };
    case types.SET_SUPPORT_MODAL_OPEN:
      return {
        ...state,
        supportModalOpen: action.payload,
      };
    case types.SET_ABOUT_MODAL_OPEN:
      return {
        ...state,
        aboutModalOpen: action.payload,
      };
    case types.SET_ALERT_MODAL_OPEN:
      return {
        ...state,
        alertModalOpen: action.payload,
      };
    case types.SET_CONFIRM_DELETE_WORKLOG_MODAL_OPEN:
      return {
        ...state,
        confirmDeleteWorklogModalOpen: action.payload,
      };
    case types.SET_WORKLOG_MODAL_OPEN:
      return {
        ...state,
        worklogModalOpen: action.payload,
      };
    case types.SET_EDIT_WORKLOG_MODAL_OPEN:
      return {
        ...state,
        editWorklogModalOpen: action.payload,
      };
    case types.ADD_FLAG:
      return {
        ...state,
        flags: [action.payload, ...state.flags],
      };
    case types.DELETE_FLAG:
      return {
        ...state,
        flags: state.flags.filter(f => f.id !== action.id),
      };
    case types.___CLEAR_ALL_REDUCERS___:
      return initialState;
    case types.SET_SCREENSHOTS_ALLOWED:
      return {
        ...state,
        screenshotsAllowed: action.payload,
      };
    default:
      return state;
  }
}
