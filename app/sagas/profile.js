// @flow
import { race, take, put, call, fork, cancel } from 'redux-saga/effects';
// import keytar from 'keytar';
import Raven from 'raven-js';
import { ipcRenderer, remote } from 'electron';
import { types, profileActions, clearAllReducers, settingsActions } from 'actions';
import * as Api from 'api';
import mixpanel from 'mixpanel-browser';
import type {
  ErrorObj,
  AuthFormData,
  User,
  ChronosBackendUserData,
  LoginRequestAction,
  LoginOAuthRequestAction,
  AcceptOAuthAction,
} from '../types';


import { getSettings } from './settings';
import { getWorklogTypes } from './worklogTypes';
import { fetchIssueTypes, fetchIssueStatuses, fetchIssueFields, fetchEpics } from './issues';
import { setToStorage, removeFromStorage } from './storage';
import { throwError, infoLog } from './ui';

import Socket from '../socket';
import jira from '../utils/jiraClient';

export function* initializeMixpanel(): Generator<*, void, *> {
  if (process.env.DISABLE_MIXPANEL === '1') {
    yield call(infoLog, 'mixpanel disabled with ENV var');
    yield cancel();
  }
  if (!process.env.MIXPANEL_API_TOKEN) {
    yield call(throwError, 'MIXPANEL_API_TOKEN not set!');
    yield cancel();
  }
  yield call(mixpanel.init, process.env.MIXPANEL_API_TOKEN);
}

function* loginError(error: ErrorObj): Generator<*, void, *> {
  const errorMessage: string = error.message || 'Unknown error';
  yield put(profileActions.throwLoginError(errorMessage));
}

function identifyInSentryAndMixpanel(host: string, userData: User): void {
  mixpanel.identify((`${host} - ${userData.emailAddress}`));
  mixpanel.people.set({
    host,
    locale: userData.locale,
    $timezone: userData.timeZone,
    $name: userData.displayName,
    $email: userData.emailAddress,
    $distinct_id: `${host} - ${userData.emailAddress}`,
  });
  Raven.setUserContext({
    host,
    locale: userData.locale,
    timeZone: userData.timeZone,
    name: userData.displayName,
    email: userData.emailAddress,
  });
}

function* jiraLogin(values: AuthFormData): Generator<*, boolean, *> {
  try {
    const userData: User = yield call(Api.jiraAuth, values);
    yield call(identifyInSentryAndMixpanel, values.host, userData);
    yield put(profileActions.fillUserData(userData));
    return true;
  } catch (err) {
    yield put(profileActions.setLoginFetching(false));
    yield call(throwError, err);
    const humanReadableError = new Error('Cannot authorize to JIRA, check credentials and try again');
    yield call(loginError, humanReadableError);
    return false;
  }
}

function* chronosBackendLogin(values: AuthFormData): Generator<*, boolean, *> {
  try {
    const { token }: { token: string } = yield call(Api.chronosBackendAuth, values);
    yield call(setToStorage, 'desktop_tracker_jwt', token);
    return true;
  } catch (err) {
    yield put(profileActions.setLoginFetching(false));
    yield call(throwError, err);
    const humanReadableError = new Error('Cannot connect to server, check credentials and try again');
    yield call(loginError, humanReadableError);
    return false;
  }
}


export function* checkJWT(): Generator<*, void, *> {
  yield take(types.CHECK_JWT_REQUEST);
  yield put(profileActions.setLoginFetching(true));
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
    yield put(profileActions.setLoginFetching(false));
    yield call(throwError, err);
    const humanReadableError = new Error('Failed to check JWT for some reason, please try again');
    yield call(loginError, humanReadableError);
  }
}

function* afterLogin(): Generator<*, void, *> {
  yield fork(getWorklogTypes);
  yield fork(getSettings);
  yield put(settingsActions.requestLocalDesktopSettings());
  yield put(profileActions.setLoginFetching(false));
  yield put(profileActions.setAuthorized(true));
  yield fork(fetchIssueTypes);
  yield fork(fetchIssueStatuses);
  yield fork(fetchIssueFields);
  yield fork(fetchEpics);
  Socket.login();
  // yield put({ type: types.CHECK_OFFLINE_SCREENSHOTS });
  // yield put({ type: types.CHECK_OFFLINE_WORKLOGS });
}

export function* loginFlow(): Generator<*, void, *> {
  while (true) {
    try {
      const { payload }: LoginRequestAction = yield take(types.LOGIN_REQUEST);
      const { host } = payload;
      yield put(profileActions.setLoginFetching(true));
      yield put(profileActions.setHost(payload.host));
      const chronosBackendLoginSuccess: boolean = yield call(chronosBackendLogin, payload);
      if (chronosBackendLoginSuccess) {
        const jiraLoginSuccess: boolean = yield call(jiraLogin, payload);
        if (jiraLoginSuccess) {
          yield call(setToStorage, 'jira_credentials', { ...payload, password: '' });
          yield call((): void => { ipcRenderer.sendSync('store-credentials', payload); });
          yield call(afterLogin);
        }
      }
      yield put(profileActions.setLoginFetching(false));
    } catch (err) {
      yield put(profileActions.setLoginFetching(false));
      yield call(throwError, err);
      const humanReadableError = new Error('Can not authenticate user. Please try again');
      yield call(loginError, humanReadableError);
      Raven.captureException(err);
    }
  }
}

export function* loginOAuthFlow(): Generator<*, void, *> {
  while (true) {
    try {
      const { payload, meta }: LoginOAuthRequestAction = yield take(types.LOGIN_OAUTH_REQUEST);

      // collecting basic oAuth data
      const host: string = payload;
      yield put(profileActions.setHost(host));
      yield call(setToStorage, 'jira_credentials', { host });
      const oAuthData = yield call(Api.getDataForOAuth, host);
      let accessToken: string;
      let tokenSecret: string;
      if (meta) {
        accessToken = meta.accessToken; // eslint-disable-line
        tokenSecret = meta.tokenSecret; // eslint-disable-line
      } else {
        const { token, url, ...rest }: { token: string, url: string, tokenSecret: string } =
          yield call(Api.getOAuthUrl, { oauth: oAuthData, host });

        tokenSecret = rest.tokenSecret; // eslint-disable-line

        // opening oAuth modal
        ipcRenderer.send('open-oauth-url', url);

        const { code, denied }: { code: AcceptOAuthAction, denied: boolean | void } = yield race({
          code: take(types.ACCEPT_OAUTH),
          denied: take(types.DENY_OAUTH),
        });
        yield put(profileActions.setLoginFetching(true));

        if (denied) {
          throw new Error('OAuth denied');
        }

        // if not denied get oAuth Token
        accessToken = yield call(Api.getOAuthToken, {
          host,
          oauth: {
            token,
            token_secret: tokenSecret,
            oauth_verifier: code.payload,
            consumer_key: oAuthData.consumerKey,
            private_key: oAuthData.privateKey,
          },
        });

        const data = yield call(
          Api.chronosBackendOAuth,
          { baseUrl: host, token: accessToken, token_secret: tokenSecret },
        );

        yield call(setToStorage, 'desktop_tracker_jwt', data.token);
      }

      yield call(jira.oauth, {
        host,
        oauth: {
          token: accessToken,
          token_secret: tokenSecret,
          consumer_key: oAuthData.consumerKey,
          private_key: oAuthData.privateKey,
        },
      });

      const userData: User = yield call(Api.jiraProfile);

      yield call(identifyInSentryAndMixpanel, host, userData);

      yield put(profileActions.fillUserData(userData));

      yield call(afterLogin);
    } catch (err) {
      yield put(profileActions.setLoginFetching(false));
      yield call(throwError, err);
      const humanReadableError = new Error('OAuth failed for unknown reason.');
      yield call(loginError, humanReadableError);
      Raven.captureException(err);
    }
  }
}

export function* logoutFlow(): Generator<*, *, *> {
  while (true) {
    yield take(types.LOGOUT_REQUEST);
    const { getGlobal } = remote;
    const { running, uploading } = getGlobal('sharedObj');

    if (running) {
      // eslint-disable-next-line no-alert
      window.alert('Tracking in progress, save worklog before logout!');
    }
    if (uploading) {
      // eslint-disable-next-line no-alert
      window.alert('Currently app in process of saving worklog, wait few seconds please');
    }
    yield call(removeFromStorage, 'desktop_tracker_jwt');
    yield put(clearAllReducers());
  }
}
