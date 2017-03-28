import * as types from '../constants/';


export function login(data, backendLogin = true) {
  return {
    type: types.LOGIN_REQUEST,
    backendLogin,
    payload: data,
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
