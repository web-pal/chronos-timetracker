import * as types from '../constants/';

export default function settings(state = new Immutable.Map(), action) {
  switch (action.type) {
    case types.FILL_SETTINGS:
      return Immutable.fromJS(action.payload);
    case types.CLEAR_ALL_REDUCERS:
      return new Immutable.Map();
    default:
      return state;
  }
}
