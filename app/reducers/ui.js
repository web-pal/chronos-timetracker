// @flow
import { types } from 'actions';
import type { Action, UiState } from '../types';

const initialState: UiState = {
  authFormStep: 1,
  sidebarType: 'all',
  issueViewTab: 'Details',
  initializeInProcess: false,
  updateCheckRunning: false,
  updateAvailable: null,
  updateFetching: false,
  sidebarFiltersOpen: false,
  settingsModalOpen: false,
  supportModalOpen: false,
  aboutModalOpen: false,
  alertModalOpen: false,
  confirmDeleteWorklogModalOpen: false,
  worklogModalOpen: false,
  editWorklogModalOpen: false,
  flags: [],
  screenshotsAllowed: false,
};

export default function ui(state: UiState = initialState, action: Action) {
  switch (action.type) {
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
    case types.SET_SIDEBAR_FILTERS_OPEN:
      return {
        ...state,
        sidebarFiltersOpen: action.payload,
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
    case types.REMOVE_FLAG:
      return {
        ...state,
        flags: state.flags.slice(1),
      };
    case types.ADD_FLAG:
      return {
        ...state,
        flags: [...state.flags, {
          ...action.payload,
          id: state.flags.length,
        }],
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
