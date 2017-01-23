import * as types from '../constants/';

const InitialState = Immutable.Record({
  settings: Immutable.Map(),
});

const initialState = new InitialState();

export default function settings(state = initialState, action) {
  switch (action.type) {
    case types.GET_SETTINGS:
      return state.set('settings', Immutable.fromJS(action.payload));
    default:
      return state;
  }
}
