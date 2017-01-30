import * as types from '../constants/ui';

const InitialState = Immutable.Record({
  descriptionPopupOpen: false,
  sidebarType: 'Recent',
  idleState: false,
});

const initialState = new InitialState();

export default function ui(state = initialState, action) {
  switch (action.type) {
    case types.OPEN_DESCRIPTION_POPUP:
      return state.set('descriptionPopupOpen', true);
    case types.CLOSE_DESCRIPTION_POPUP:
      return state.delete('descriptionPopupOpen');
    case types.SET_SIDEBAR_TYPE:
      return state.set('sidebarType', action.payload);
    case types.SET_IDLE_STATE:
      return state.set('idleState', action.payload);
    default:
      return state;
  }
}
