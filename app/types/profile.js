// @flow
import { types } from 'actions';
import type { Action } from './index';

// TODO type for jira ApplicationRole
export type ApplicationRole = any;

// TODO type for jira Group
export type Group = any;

export type User = {
  accountId: string,
  active: boolean,
  applicationRoles?: {
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
  expand?: string,
  groups?: {
    size: number,
    items: Array<Group>,
  },
  key: string,
  locale?: string,
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

export type oAuthData = {
  token: string,
  token_secret: string,
  oauth_verifier: string,
  consumer_key: string,
  private_key: string,
};

export type LoginError = string;

export type ProfileState = {|
  +authorized: boolean,
  +host: URL | null,
  +userData: User | null,
  +loginError: string,
  +loginFetching: boolean,
  +isPaidUser: boolean,
|};

export type AuthFormData = {|
  +host: URL,
  +username?: string,
  +password?: string,
|};

//
export type LoginRequestAction =
  {| type: typeof types.LOGIN_REQUEST, payload: AuthFormData |};

export type LoginRequest = {
  (payload: AuthFormData): LoginRequestAction
};

//
export type LoginOAuthRequestAction =
  {
    type: typeof types.LOGIN_OAUTH_REQUEST,
    payload: string,
    meta?: { accessToken?: string, tokenSecret?: string },
  } & Action;

export type LoginOAuthRequest = {
  (host: string, meta?: { accessToken?: string, tokenSecret?: string }): LoginOAuthRequestAction
};

//
export type DenyOAuthAction =
  {| type: typeof types.DENY_OAUTH |} & Action;

export type DenyOAuth = {
  (): DenyOAuthAction
};

//
export type AcceptOAuthAction =
 {| type: typeof types.ACCEPT_OAUTH, payload: string |} & Action;

export type AcceptOAuth = {
  (payload: string): AcceptOAuthAction;
}

//
export type LogoutRequestAction =
 {| type: typeof types.LOGOUT_REQUEST |} & Action;

export type LogoutRequest = {
  (): LogoutRequestAction
};

//
export type SetAuthorizedAction =
 {| type: typeof types.SET_AUTHORIZED, payload: boolean |} & Action;

export type SetAuthorized = {
  (payload: boolean): SetAuthorizedAction
};

//
export type ThrowLoginErrorAction =
 {| type: typeof types.THROW_LOGIN_ERROR, payload: LoginError |} & Action;

export type ThrowLoginError = {
  (payload: LoginError): ThrowLoginErrorAction
};

//
export type FillUserDataAction =
 {| type: typeof types.FILL_USER_DATA, payload: User |} & Action;

export type FillUserData = {
  (payload: User): FillUserDataAction
};

//
export type SetHostAction =
 {| type: typeof types.SET_HOST, payload: URL |} & Action;

export type SetHost = {
  (payload: URL): SetHostAction
};

//
export type SetProtocolAction =
 {| type: typeof types.SET_PROTOCOL, payload: string |} & Action;

export type SetProtocol = {
  (payload: string): SetProtocolAction
};

//
export type SetLoginFetchingAction =
 {| type: typeof types.SET_LOGIN_FETCHING, payload: boolean |} & Action;

export type SetLoginFetching = {
  (payload: boolean): SetLoginFetchingAction
};

//
export type SetIsPaidUserAction =
 {| type: typeof types.SET_IS_PAID_USER, payload: boolean |} & Action;

export type SetIsPaidUser = {
  (payload: boolean): SetIsPaidUserAction
};

export type ProfileAction =
  LoginRequestAction
  | LoginOAuthRequestAction
  | DenyOAuthAction
  | AcceptOAuthAction
  | LogoutRequestAction
  | SetAuthorizedAction
  | ThrowLoginErrorAction
  | FillUserDataAction
  | SetHostAction
  | SetLoginFetchingAction
  | SetIsPaidUserAction;
