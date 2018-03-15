// @flow
import type {
  AuthAction,
} from 'types';

import * as actionTypes from './actionTypes';


export const loginRequest = (payload : {|
  host: string,
  username: string,
  password: string,
|}): AuthAction => ({
  type: actionTypes.LOGIN_REQUEST,
  payload,
});

export const loginOAuthRequest = (host: string): AuthAction => ({
  type: actionTypes.LOGIN_OAUTH_REQUEST,
  host,
});

export const logoutRequest = (): AuthAction => ({
  type: actionTypes.LOGOUT_REQUEST,
});

export const acceptOAuth = (code: string): AuthAction => ({
  type: actionTypes.ACCEPT_OAUTH,
  code,
});

export const denyOAuth = (): AuthAction => ({
  type: actionTypes.DENY_OAUTH,
});
