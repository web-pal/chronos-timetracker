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

export const logoutRequest = (payload: {
  dontForget: boolean
} = { dontForget: false }): AuthAction => ({
  type: actionTypes.LOGOUT_REQUEST,
  payload,
});

export const acceptOAuth = (code: string): AuthAction => ({
  type: actionTypes.ACCEPT_OAUTH,
  code,
});

export const denyOAuth = (): AuthAction => ({
  type: actionTypes.DENY_OAUTH,
});

export const switchAccount = (payload: {|
  host: string,
  username: string,
|}) => ({
  type: actionTypes.SWITCH_ACCOUNT,
  payload,
});

export const addAuthDebugMessage = (payload: Array<*>) => ({
  type: actionTypes.ADD_AUTH_DEBUG_MESSAGE,
  payload,
});
