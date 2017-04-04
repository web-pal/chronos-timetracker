import * as types from '../constants/';


export function login(data, backendLogin = true) {
  return {
    type: types.LOGIN_REQUEST,
    backendLogin,
    payload: data,
  };
}

export function loginOAuth(data, backendLogin = true) {
  return {
    type: types.LOGIN_OAUTH_REQUEST,
    backendLogin,
    payload: data,
  };
}

export function deniedOAuth() {
  return {
    type: types.LOGIN_OAUTH_DENIED,
  };
}

export function throwLoginError(error) {
  return {
    type: types.THROW_LOGIN_ERROR,
    payload: { error },
  };
}

export function continueOAuthWithCode(code) {
  return {
    type: types.LOGIN_OAUTH_HAVE_CODE,
    code,
  };
}

export function checkJWT() {
  return {
    type: types.CHECK_JWT,
  };
}

export function logout() {
  return {
    type: types.LOGOUT_REQUEST,
  };
}

