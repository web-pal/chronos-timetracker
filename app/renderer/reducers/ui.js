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

export const persistInitialState = {
  sidebarType: 'all',
  issueViewTab: 'Details',
  issuesSearch: '',
  issuesFilters: {
    type: [],
    status: [],
    assignee: [],
  },

  postAlsoAsIssueComment: false,
  screenshotsAllowed: false,

  issuesSourceType: null,
  issuesSourceId: null,
  issuesSprintId: null,
};


const initialState: UiState = {
  initializeInProcess: false,
  authorized: false,
  accounts: [],
  acknowlegdedFeatures: [],
  authFormStep: 1,
  authFormIsComplete: false,
  authError: null,
  authRequestInProcess: false,
  hostname: null,
  protocol: null,

  showAuthDebugConsole: false,
  authDebugMessages: [],

  confirmUnload: false,
  updateCheckRunning: false,
  updateFetching: false,
  updateAvailable: null,
  saveWorklogInProcess: false,
  saveFilterDialogOpen: false,

  issueViewWorklogsScrollToIndex: 0,
  selectedIssueId: null,
  trackingIssueId: null,
  selectedWorklogId: null,
  deleteWorklogId: null,
  editWorklogId: null,
  worklogFormIssueId: null,
  worklogComment: '',

  newJQLFilterErrors: [],
  newJQLFilterName: null,
  newJQLFilterValue: null,

  remainingEstimateValue: 'auto',
  remainingEstimateNewValue: '',
  remainingEstimateReduceByValue: '',

  sidebarFiltersIsOpen: false,
  isCommentDialogOpen: false,
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
  ...persistInitialState,
};

const mergeValues = (
  values,
  state,
) => (
  Object.keys(values).reduce((s, v) => ({
    ...s,
    [v]: values[v]?._merge ? ({ /* eslint-disable-line */
      ...state[v],
      ...values[v],
    }) : (
      values[v]
    ),
  }), {})
);

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
    case actionTypes.SET_UI_STATE2: {
      const {
        keyOrRootValues,
        maybeValues,
      } = action.payload;
      const [
        values,
        key,
      ] = (
        maybeValues === undefined
          ? [
            keyOrRootValues,
            null,
          ]
          : [
            maybeValues,
            keyOrRootValues,
          ]
      );
      return {
        ...state,
        ...(
          key
            ? ({
              [key]: {
                ...state[key],
                ...mergeValues(
                  values,
                  state[key],
                ),
              },
            })
            : (
              mergeValues(
                values,
                state,
              )
            )
        ),
      };
    }
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
