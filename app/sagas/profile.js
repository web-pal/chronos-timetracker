// @flow
import { race, take, put, call, fork, cancel } from 'redux-saga/effects';
import Raven from 'raven-js';
import { ipcRenderer } from 'electron';
import { types, profileActions, clearAllReducers } from 'actions';
import * as Api from 'api';
import type {
  ErrorObj,
  AuthFormData,
  UserData,
  ChronosBackendUserData,
  LoginRequestAction,
  LoginOAuthRequestAction,
  AcceptOAuthAction,
} from '../types';

import { getSettings } from './settings';
import { getWorklogTypes } from './worklogTypes';
import { setToStorage, removeFromStorage } from './storage';

import Socket from '../socket';
import jira from '../utils/jiraClient';

function* loginError(error: ErrorObj): Generator<*, void, *> {
  const errorMessage: string = error.message || 'Unknown error';
  yield put(profileActions.throwLoginError(errorMessage));
}

function* jiraLogin(values: AuthFormData): Generator<*, boolean, *> {
  try {
    const userData: UserData = yield call(Api.jiraAuth, values);
    Raven.setUserContext({
      host: values.host,
      locale: userData.locale,
      timeZone: userData.timeZone,
      name: userData.displayName,
      email: userData.emailAddress,
    });
    yield put(profileActions.fillUserData(userData));
    return true;
  } catch (err) {
    yield call(loginError, err);
    return false;
  }
}

function* chronosBackendLogin(values: AuthFormData): Generator<*, boolean, *> {
  try {
    const { token }: { token: string } = yield call(Api.chronosBackendAuth, values);
    yield call(setToStorage, 'desktop_tracker_jwt', token);
    return true;
  } catch (err) {
    yield call(loginError, err);
    return false;
  }
}


export function* checkJWT(): Generator<*, void, *> {
  yield take(types.CHECK_JWT_REQUEST);
  // yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: true });
  try {
    const userData: ChronosBackendUserData = yield call(Api.chronosBackendGetJiraCredentials);
    if (userData.authType === 'basic_auth' || userData.authType === undefined) {
      yield put(profileActions.loginRequest({
        host: userData.baseUrl.split('.')[0],
        username: userData.username,
        password: userData.password,
      }));
    }
    if (userData.authType === 'OAuth') {
      yield put(profileActions.loginOAuthRequest(userData.baseUrl, {
        accessToken: userData.token,
        tokenSecret: userData.token_secret,
      }));
    }
  } catch (err) {
    yield loginError(err);
    // yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
  }
}

export function* loginFlow(): Generator<*, void, *> {
  while (true) {
    const { payload }: LoginRequestAction = yield take(types.LOGIN_REQUEST);
    const chronosBackendLoginSuccess: boolean = yield call(chronosBackendLogin, payload);
    if (!chronosBackendLoginSuccess) yield cancel();
    const jiraLoginSuccess: boolean = yield call(jiraLogin, payload);
    if (!jiraLoginSuccess) yield cancel();

    // yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: true });
    if (jiraLoginSuccess && chronosBackendLoginSuccess) {
      yield call(setToStorage, 'jira_credentials', { ...payload, password: '' });
      yield fork(getWorklogTypes);
      yield fork(getSettings);
      yield put(profileActions.setHost(payload.host));
      // yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
      yield put(profileActions.setAuthorized(true));
      // yield put({ type: types.CHECK_OFFLINE_SCREENSHOTS });
      // yield put({ type: types.CHECK_OFFLINE_WORKLOGS });
      Socket.login();
      yield take(types.LOGOUT_REQUEST);
      yield call(removeFromStorage, 'desktop_tracker_jwt');
      yield put(clearAllReducers());
    }
    // yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
  }
}

export function* loginOAuthFlow(): Generator<*, void, *> {
  while (true) {
    try {
      const { payload, meta }: LoginOAuthRequestAction = yield take(types.LOGIN_OAUTH_REQUEST);

      // collecting basic oAuth data
      const host: string = payload;
      const oAuthData = yield call(Api.getDataForOAuth, host);
      let accessToken: string;
      let tokenSecret: string;
      if (meta) {
        accessToken = meta.accessToken;
        tokenSecret = meta.tokenSecret;
      } else {
        const { token, url, ...rest }: { token: string, url: string, tokenSecret: string } =
          yield call(Api.getOAuthUrl, { oauth: oAuthData, host });

        tokenSecret = rest.tokenSecret;

        // opening oAuth modal
        ipcRenderer.send('open-oauth-url', url);

        const { code, denied }: { code: AcceptOAuthAction, denied: boolean | void } = yield race({
          code: take(types.ACCEPT_OAUTH),
          denied: take(types.DENY_OAUTH),
        });

        if (denied) {
          throw new Error('OAuth denied');
        }

        // if not denied get oAuth Token
        accessToken = yield call(Api.getOAuthToken,
          { host,
            oauth: {
              token,
              token_secret: tokenSecret,
              oauth_verifier: code.payload,
              consumer_key: oAuthData.consumerKey,
              private_key: oAuthData.privateKey,
            },
          },
        );

        const data = yield call(
          Api.chronosBackendOAuth,
          { baseUrl: host, token: accessToken, token_secret: tokenSecret },
        );

        yield call(setToStorage, 'desktop_tracker_jwt', data.token);
      }

      yield call(jira.oauth,
        { host,
          oauth: {
            token: accessToken,
            token_secret: tokenSecret,
            consumer_key: oAuthData.consumerKey,
            private_key: oAuthData.privateKey,
          },
        },
      );

      const userData: UserData = yield call(Api.jiraProfile);

      yield put(profileActions.fillUserData(userData));
      yield put(profileActions.setHost(host));
      yield put(profileActions.setAuthorized(true));
      yield call(getSettings);
      // yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
      // yield put({ type: types.CHECK_OFFLINE_SCREENSHOTS });
      // yield put({ type: types.CHECK_OFFLINE_WORKLOGS });
      // Socket.login();
      yield take(types.LOGOUT_REQUEST);
      yield call(removeFromStorage, 'desktop_tracker_jwt');
      yield put(clearAllReducers());
    } catch (err) {
      yield call(loginError, err);
      Raven.captureException(err);
    }
  }
}
