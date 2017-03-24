import { fromJS } from 'immutable';

import * as types from '../constants/';


const InitialState = Immutable.Record({
  dispersion: '0',
  interval: '600',

  screenshotsPeriod: 600,
  screenshotsQuantity: 2,

  screenshotsEnabled: '',
  screenshotsEnabledUsers: Immutable.List([]),
});
const initialState = new InitialState();

export default function settings(state = initialState, action) {
  switch (action.type) {
    case types.FILL_SETTINGS:
      return state.merge(fromJS(action.payload));
    case types.CLEAR_ALL_REDUCERS:
      return new InitialState();
    default:
      return state;
  }
}
