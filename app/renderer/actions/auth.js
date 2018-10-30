// @flow
import type {
  AuthAction,
} from 'types';

import * as actionTypes from './actionTypes';


export const authRequest = (payload: {|
  name: string,
  hostname: string,
  pathname: string,
|}): AuthAction => ({
  type: actionTypes.AUTH_REQUEST,
  payload,
});

export const authSelfHostRequest = (payload: {|
  username: string,
  password: string,
|}): AuthAction => ({
  type: actionTypes.AUTH_SELF_HOST_REQUEST,
  payload,
});

export const logoutRequest = (payload: {
  dontForget: boolean
} = { dontForget: false }): AuthAction => ({
  type: actionTypes.LOGOUT_REQUEST,
  payload,
});

export const switchAccount = (payload: {|
  name: string,
  hostname: string,
  pathname: string,
|}) => ({
  type: actionTypes.SWITCH_ACCOUNT,
  payload,
});

export const addAuthDebugMessage = (payload: Array<*>) => ({
  type: actionTypes.ADD_AUTH_DEBUG_MESSAGE,
  payload,
});
