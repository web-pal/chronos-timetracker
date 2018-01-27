// @flow
import { types } from 'actions';
import type { ProfileState, Action } from '../types';

const initialState: ProfileState = {
  authorized: false,
  host: null,
  protocol: null,
  userData: null,
  loginError: '',
  loginFetching: false,
  isPaidUser: false,
};

function profile(state: ProfileState = initialState, action: Action) {
  switch (action.type) {
    case types.SET_AUTHORIZED:
      return {
        ...state,
        authorized: action.payload,
      };
    case types.FILL_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };
    case types.SET_HOST:
      return {
        ...state,
        host: action.payload,
      };
    case types.SET_PROTOCOL:
      return {
        ...state,
        protocol: action.payload,
      };
    case types.THROW_LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload,
      };
    case types.SET_LOGIN_FETCHING:
      return {
        ...state,
        loginFetching: action.payload,
      };
    case types.SET_IS_PAID_USER:
      return {
        ...state,
        isPaidUser: action.payload,
      };
    case types.___CLEAR_ALL_REDUCERS___:
      return initialState;
    default:
      return state;
  }
}

export default profile;
