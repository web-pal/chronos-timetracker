import { take, put, call } from 'redux-saga/effects';
import storage from 'electron-json-storage';
import {
  jiraAuth, chronosBackendAuth,
  chronosBackendGetJiraCredentials, fetchSettings,
} from 'api';
import * as types from '../constants/';
import { rememberToken } from '../utils/api/helper';
import { login } from '../actions/profile';
import Socket from '../socket';


// ====Login Flow====
function* loginError(error) {
  yield put({
    type: types.THROW_LOGIN_ERROR,
    payload: { error },
  });
  yield put({ type: types.SET_AUTH_STATE, payload: false });
}

function* jiraLogin(values) {
  let success = true;
  try {
    const userData = yield call(jiraAuth, values);
    yield put({ type: types.FILL_PROFILE, payload: userData });
  } catch (err) {
    yield loginError('Cannot authorize to JIRA. Check your credentials and try again');
    success = false;
  }
  return success;
}

function* chronosBackendLogin(values) {
  let success = true;
  try {
    const { token } = yield call(chronosBackendAuth, values);
    yield storage.set('desktop_tracker_jwt', token);
    rememberToken(token);
  } catch (err) {
    yield loginError(err);
    success = false;
  }
  return success;
}

function* getSettings() {
  try {
    const { payload } = yield call(fetchSettings);
    yield put({ type: types.FILL_SETTINGS, payload });
  } catch (err) {
    console.log(err);
  }
}

export function* checkJWT() {
  yield take(types.CHECK_JWT);
  yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: true });
  try {
    const userData = yield call(chronosBackendGetJiraCredentials);
    yield put(login({ values: { ...userData, host: userData.baseUrl.split('.')[0] } }, false));
  } catch (err) {
    yield loginError('Automatic login failed, please enter your credentials again');
    yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
  }
}

export function* loginFlow() {
  while (true) {
    const { backendLogin, payload: { values, resolve } } = yield take(types.LOGIN_REQUEST);
    let chronosBackendLoginSuccess = !backendLogin;
    let jiraLoginSuccess = false;

    yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: true });
    jiraLoginSuccess = yield jiraLogin(values);
    if (jiraLoginSuccess && backendLogin) {
      storage.set('jira_credentials', { ...values, password: '' });
      chronosBackendLoginSuccess = yield chronosBackendLogin(values);
    }
    if (jiraLoginSuccess && chronosBackendLoginSuccess) {
      yield getSettings();
      yield put({ type: types.SET_CURRENT_HOST, payload: values.host });
      yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
      yield put({ type: types.SET_AUTH_STATE, payload: true });
      Socket.login();
      yield take(types.LOGOUT_REQUEST);
      storage.remove('desktop_tracker_jwt');
      yield put({ type: types.CLEAR_ALL_REDUCERS });
    }
    yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
    if (resolve) {
      resolve();
    }
  }
}
