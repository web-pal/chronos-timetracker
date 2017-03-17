import { Record, Map, fromJS } from 'immutable';

import * as types from '../constants';

const InitialState = Record({
  isAuthorized: false,
  userData: Map(),
  loginRequestInProcess: false,
  loginError: '',
});
const initialState = new InitialState();


export default function profile(state = initialState, action) {
  switch (action.type) {
    case types.SET_LOGIN_REQUEST_STATE:
      return state.set('loginRequestInProcess', action.payload);
    case types.FILL_PROFILE:
      return state.set('userData', fromJS(action.payload));
    case types.THROW_LOGIN_ERROR:
      return state.set('loginError', action.payload.error);
    case types.SET_AUTH_STATE:
      return state.set('isAuthorized', action.payload);
    case types.CLEAR_ALL_REDUCERS:
      return new InitialState();
    default:
      return state;
  }
}
