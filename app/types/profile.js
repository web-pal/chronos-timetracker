// @flow
import { types } from 'actions';
import type { Action } from './index';

// TODO type for jira ApplicationRole
export type ApplicationRole = any;

// TODO type for jira Group
export type Group = any;

export type UserData = {
  accountId: string,
  active: boolean,
  applicationRoles: {
    size: number,
    items: Array<ApplicationRole>,
  },
  avatarUrls: {
    '16x16': string,
    '24x24': string,
    '32x32': string,
    '48x48': string,
  },
  displayName: string,
  emailAddress: string,
  expand: string,
  groups: {
    size: number,
    items: Array<Group>,
  },
  key: string,
  locale: string,
  self: string,
  timeZone: string,
};

export type ChronosBackendUserData = {
  authType: string,
  baseUrl: string,
  exp: number,
  iat: number,
  userId: string,

  // if authType is 'basic_auth'
  username?: string,
  password?: string,

  // if authType is 'OAuth'
  token?: string,
  token_secret?: string,
};

export type LoginError = string;

export type ProfileState = {|
  +authorized: boolean,
  +host: string | null,
  +userData: UserData | null,
  +loginError: string,
|};

export type AuthFormData = {|
  +host: string,
  +username: string,
  +password: string,
|};

//
export type LoginRequestAction =
  {| type: types.LOGIN_REQUEST, payload: AuthFormData |} & Action;

export type LoginRequest = {
  (payload: AuthFormData): LoginRequestAction
};

//
export type LoginOAuthRequestAction =
  {
    type: types.LOGIN_OAUTH_REQUEST,
    payload: string,
    meta: { accessToken: string, tokenSecret: string },
  } & Action;

export type LoginOAuthRequest = {
  (host: string, meta: { accessToken: string, tokenSecret: string }): LoginOAuthRequestAction
};

//
export type DenyOAuthAction =
  {| type: types.DENY_OAUTH |} & Action;

export type DenyOAuth = {
  (): DenyOAuthAction
};

//
export type AcceptOAuthAction =
 {| type: types.ACCEPT_OAUTH, payload: string |} & Action;

export type AcceptOAuth = {
  (payload: string): AcceptOAuthAction;
}

//
export type CheckJWTRequestAction =
 {| type: types.CHECK_JWT_REQUEST |} & Action;

export type CheckJWTRequest = {
  (): CheckJWTRequestAction
};

//
export type LogoutRequestAction =
 {| type: types.LOGOUT_REQUEST |} & Action;

export type LogoutRequest = {
  (): LogoutRequestAction
};

//
export type SetAuthorizedAction =
 {| type: types.SET_AUTHORIZED, payload: boolean |} & Action;

export type SetAuthorized = {
  (payload: boolean): SetAuthorizedAction
};

//
export type ThrowLoginErrorAction =
 {| type: types.THROW_LOGIN_ERROR, payload: LoginError |} & Action;

export type ThrowLoginError = {
  (payload: LoginError): ThrowLoginErrorAction
};

//
export type FillUserDataAction =
 {| type: types.FILL_USER_DATA, payload: UserData |};

export type FillUserData = {
  (payload: UserData): FillUserDataAction
};

//
export type SetHostAction =
 {| type: types.SET_HOST, payload: string |};

export type SetHost = {
  (payload: string): SetHostAction
};

export type ProfileAction =
  LoginRequestAction
  | LoginOAuthRequestAction
  | DenyOAuthAction
  | AcceptOAuthAction
  | CheckJWTRequestAction
  | LogoutRequestAction
  | SetAuthorizedAction
  | ThrowLoginErrorAction
  | FillUserDataAction
   | SetHostAction;

export type ProfileActionCreator =
  LoginRequest
  | LoginOAuthRequest
  | DenyOAuth
  | AcceptOAuth
  | CheckJWTRequest
  | LogoutRequest
  | SetAuthorized
  | ThrowLoginError
  | FillUserData
  | SetHost;

