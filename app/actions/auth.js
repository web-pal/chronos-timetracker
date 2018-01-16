// @flow
import type {
  LoginRequest, LoginRequestAction,
  LoginOAuthRequest, LoginOAuthRequestAction,
  DenyOAuth, DenyOAuthAction,
  AcceptOAuth, AcceptOAuthAction,
  LogoutRequest, LogoutRequestAction,
  SetAuthorized, SetAuthorizedAction,
  ThrowLoginError, ThrowLoginErrorAction,
  SetLoginFetching, SetLoginFetchingAction,
  LoginError, AuthFormData,
} from '../types';

import * as types from './actionTypes/';

export const loginRequest: LoginRequest = (
  payload: AuthFormData,
): LoginRequestAction => ({
  type: types.LOGIN_REQUEST,
  payload,
});

export const loginOAuthRequest: LoginOAuthRequest = (
  host: string,
  meta?: { accessToken?: string, tokenSecret?: string },
): LoginOAuthRequestAction => ({
  type: types.LOGIN_OAUTH_REQUEST,
  payload: host,
  meta,
});

export const denyOAuth: DenyOAuth = (): DenyOAuthAction => ({
  type: types.DENY_OAUTH,
});

export const acceptOAuth: AcceptOAuth = (
  payload: string,
): AcceptOAuthAction => ({
  type: types.ACCEPT_OAUTH,
  payload,
});

export const logoutRequest: LogoutRequest = (): LogoutRequestAction => ({
  type: types.LOGOUT_REQUEST,
});

export const setAuthorized: SetAuthorized = (
  payload: boolean,
): SetAuthorizedAction => ({
  type: types.SET_AUTHORIZED,
  payload,
});

export const throwLoginError: ThrowLoginError = (
  payload: LoginError,
): ThrowLoginErrorAction => ({
  type: types.THROW_LOGIN_ERROR,
  payload,
});

export const setLoginFetching: SetLoginFetching = (
  payload: boolean,
): SetLoginFetchingAction => ({
  type: types.SET_LOGIN_FETCHING,
  payload,
});
