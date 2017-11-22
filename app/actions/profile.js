// @flow
import type {
  LoginRequest, LoginRequestAction,
  LoginOAuthRequest, LoginOAuthRequestAction,
  DenyOAuth, DenyOAuthAction,
  AcceptOAuth, AcceptOAuthAction,
  CheckJWTRequest, CheckJWTRequestAction,
  LogoutRequest, LogoutRequestAction,
  SetAuthorized, SetAuthorizedAction,
  ThrowLoginError, ThrowLoginErrorAction,
  FillUserData, FillUserDataAction,
  SetHost, SetHostAction,
  SetLoginFetching, SetLoginFetchingAction,
  SetIsPaidUser, SetIsPaidUserAction,
  LoginError, AuthFormData, User,
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

export const checkJWTRequest: CheckJWTRequest = (): CheckJWTRequestAction => ({
  type: types.CHECK_JWT_REQUEST,
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

export const setHost: SetHost = (
  payload: string,
): SetHostAction => ({
  type: types.SET_HOST,
  payload,
});

export const fillUserData: FillUserData = (
  payload: User,
): FillUserDataAction => ({
  type: types.FILL_USER_DATA,
  payload,
});

export const setLoginFetching: SetLoginFetching = (
  payload: boolean,
): SetLoginFetchingAction => ({
  type: types.SET_LOGIN_FETCHING,
  payload,
});

export const setIsPaidUser: SetIsPaidUser = (
  payload: boolean,
): SetIsPaidUserAction => ({
  type: types.SET_IS_PAID_USER,
  payload,
});
