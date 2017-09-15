import * as types from '../constants/ui';

const InitialState = Immutable.Record({
  sidebarType: 'All',
  updateAvailable: null,
  updateFetching: false,
  downloadingUpdate: false,
  showSettingsModal: false,
  issueViewTab: 'Details',
  showTrackingView: false,
  showSidebarFilters: false,
  showSupportModal: false,
  showAboutModal: false,
});

const initialState = new InitialState();

export default function ui(state = initialState, action) {
  switch (action.type) {
    case types.SET_UPDATE_DOWNLOAD_STATE:
      return state.set('downloadingUpdate', action.payload);
    case types.NOTIFY_UPDATE_AVAILABLE:
      return state.set('updateAvailable', action.payload);
    case types.SET_UPDATE_FETCH_STATE:
      return state.set('updateFetching', action.payload);
    case types.SET_SIDEBAR_TYPE:
      return state.set('sidebarType', action.payload);
    case types.SET_SHOW_SETTINGS_MODAL:
      return state.set('showSettingsModal', action.payload);
    case types.SET_SHOW_TRACKING_VIEW:
      return state.set('showTrackingView', action.payload);
    case types.SET_ISSUE_VIEW_TAB:
      return state.set('issueViewTab', action.payload);
    case types.SET_SHOW_SIDEBAR_FILTERS:
      return state.set('showSidebarFilters', action.payload || !state.showSidebarFilters);
    case types.SET_SHOW_SUPPORT_MODAL:
      return state.set('showSupportModal', action.payload);
    case types.SET_SHOW_ABOUT_MODAL:
      return state.set('showAboutModal', action.payload);
    default:
      return state;
  }
}
