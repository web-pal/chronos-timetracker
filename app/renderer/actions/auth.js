// @flow
import type {
  AuthAction,
} from 'types';

import * as actionTypes from './actionTypes';


export const authRequest = (payload: {|
  protocol: string,
  hostname: string,
  port: string,
  pathname: string,
  cookies: any,
|}): AuthAction => ({
  type: actionTypes.AUTH_REQUEST,
  ...payload,
});

export const authSelfHostRequest = (payload: {|
  username: string,
  password: string,
|}): AuthAction => ({
  type: actionTypes.AUTH_SELF_HOST_REQUEST,
  payload,
});

export const logoutRequest = ({ forget = true }): AuthAction => ({
  type: actionTypes.LOGOUT_REQUEST,
  forget,
});

export const switchAccount = (payload: {|
  name: string,
  protocol: string,
  hostname: string,
  port: string,
  pathname: string,
|}) => ({
  type: actionTypes.SWITCH_ACCOUNT,
  ...payload,
});
