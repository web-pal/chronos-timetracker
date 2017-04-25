import { fromJS } from 'immutable';

import * as types from '../constants/';


const InitialState = Immutable.Record({
  dispersion: '0',
  interval: '600',

  screenshotsPeriod: 600,
  screenshotsQuantity: 1,

  screenshotsEnabled: '',
  screenshotsEnabledUsers: Immutable.List([]),
  localDesktopSettings: Immutable.Map({}),
});
const initialState = new InitialState();

export default function settings(state = initialState, action) {
  switch (action.type) {
    case types.FILL_SETTINGS:
      return state.merge(fromJS(action.payload));
    case types.FILL_LOCAL_DESKTOP_SETTINGS:
      return state.set('localDesktopSettings', fromJS(action.payload));
    case types.SET_LOCAL_DESKTOP_SETTINGS:
      return state.update(
        'localDesktopSettings',
        s => s.set(action.meta, action.payload)
      );
    case types.CLEAR_ALL_REDUCERS:
      return new InitialState();
    default:
      return state;
  }
}
