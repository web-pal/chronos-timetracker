import * as types from '../constants/ui';

const InitialState = Immutable.Record({
  descriptionPopupOpen: false,
});

const initialState = new InitialState();

export default function ui(state = initialState, action) {
  switch (action.type) {
    case types.OPEN_DESCRIPTION_POPUP:
      return state.set('descriptionPopupOpen', true);
    case types.CLOSE_DESCRIPTION_POPUP:
      return state.delete('descriptionPopupOpen');
    default:
      return state;
  }
}
