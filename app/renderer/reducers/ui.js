// @flow
import {
  actionTypes,
} from 'actions';
import type {
  Action,
  UiState,
} from 'types';
import * as R from 'ramda';

export const persistInitialState = {
  sidebarType: 'all',
  issueViewTab: 'Details',
  issuesSearch: '',
  issuesFilters: {},

  trayShowTimer: true,
  allowEmptyComment: true,
  showLoggedOnStop: false,
  updateChannel: 'stable',
  updateAutomatically: false,

  postAlsoAsIssueComment: false,
  screenshotsEnabled: false,
  showScreenshotPreview: true,
  useNativeNotifications: false,
  screenshotDecisionTime: 15,

  issuesSourceType: null,
  issuesSourceId: null,
  issuesSprintId: null,

  adjustStartTime: true,
  usersInTeamStatusWindow: [],
};


const initialState: UiState = {
  initializeInProcess: false,
  readyToQuit: false,
  authorized: false,
  accounts: [],
  acknowlegdedFeatures: [],
  authFormStep: 1,
  authFormIsComplete: false,
  authError: null,
  authRequestInProcess: false,
  hostname: null,
  protocol: null,

  confirmUnload: false,
  saveWorklogInProcess: false,
  saveFilterDialogOpen: false,

  takeScreenshotLoading: false,
  uploadScreenshotLoading: false,
  screenshotTime: null,
  screenshotTimeId: null,
  screenshotViewerWindowId: null,
  screenshots: [],
  activity: {},

  updateAvailable: null,
  downloadedUpdate: false,
  downloadUpdateProgress: null,

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

  settingsTab: 'General',

  modalState: {
    alert: false,
    worklogInetIssue: false,
    confirmDeleteWorklog: false,
    settings: false,
    worklog: false,
    accounts: false,
  },
  flags: [],
  quitAfterSaveWorklog: false,
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
      ...R.dissoc('_merge', values[v]),
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
    case actionTypes.SET_UI_STATE: {
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
      return R.mapObjIndexed(
        (v, k) => (action.payload.keys.includes(k) ? initialState[k] : v),
        state,
      );
    case actionTypes.SET_MODAL_STATE:
      return {
        ...state,
        modalState: {
          ...state.modalState,
          [action.payload.modalName]: action.payload.state,
        },
      };
    case actionTypes.ADD_SCREENSHOT:
      return {
        ...state,
        screenshots: [
          ...state.screenshots,
          action.payload,
        ],
      };
    case actionTypes.SET_SCREENSHOTS:
      return {
        ...state,
        screenshots: action.payload,
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
