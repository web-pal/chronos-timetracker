// @flow
import {
  actionTypes,
} from 'actions';
import type {
  Action,
  UiState,
} from 'types';
import {
  mapObjIndexed as mapObj,
} from 'ramda';


const initialState: UiState = {
  initializeInProcess: false,
  authorized: false,
  accounts: [],
  acknowlegdedFeatures: [],
  authFormStep: 1,
  authFormIsComplete: false,
  loginError: null,
  loginRequestInProcess: false,
  host: null,
  protocol: null,
  isPaidUser: false,

  showAuthDebugConsole: false,
  authDebugMessages: [],

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
  worklogComment: '',
  postAlsoAsIssueComment: false,
  remainingEstimateValue: 'auto',
  remainingEstimateNewValue: '',
  remainingEstimateReduceByValue: '',
  isCommentDialogOpen: false,

  selectedIssueId: null,
  issuesSourceType: null,
  issuesSourceId: null,
  issuesSprintId: null,

  newJQLFilterErrors: [],
  newJQLFilterName: null,
  newJQLFilterValue: null,
  saveFilterDialogOpen: false,

  screenshotsAllowed: false,
  sidebarFiltersIsOpen: false,
  filterStatusesIsFetched: false,
  commentAdding: false,

  modalState: {
    alert: false,
    confirmDeleteWorklog: false,
    settings: false,
    worklog: false,
    accounts: false,
  },

  flags: [],
};

export default function ui(
  state: UiState = initialState,
  action: Action,
) {
  switch (action.type) {
    case actionTypes.SET_UI_STATE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case actionTypes.RESET_UI_STATE:
      // $FlowFixMe
      return mapObj((v, k) => (action.payload.keys.includes(k) ? initialState[k] : v), state);
    case actionTypes.SET_MODAL_STATE:
      return {
        ...state,
        modalState: {
          ...state.modalState,
          [action.payload.modalName]: action.payload.state,
        },
      };
    case actionTypes.SET_ISSUES_FILTER:
      return {
        ...state,
        issuesFilters: {
          ...state.issuesFilters,
          [action.filterType]: action.value,
        },
      };
    case actionTypes.ADD_AUTH_DEBUG_MESSAGE:
      return {
        ...state,
        authDebugMessages: [
          ...state.authDebugMessages,
          ...action.payload,
        ],
      };
    case actionTypes.ADD_FLAG:
      return {
        ...state,
        flags: [action.payload, ...state.flags],
      };
    case actionTypes.DELETE_FLAG: {
      const { id } = action;
      return {
        ...state,
        flags: state.flags.filter(f => f.id !== id),
      };
    }
    case actionTypes.__CLEAR_ALL_REDUCERS__:
      return initialState;
    default:
      return state;
  }
}
