import * as types from '../constants/ui';

const InitialState = Immutable.Record({
  sidebarType: 'All',
  updateAvailable: null,
  updateFetching: false,
  downloadingUpdate: false,
  showSettingsModal: false,
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
    default:
      return state;
  }
}
