// @flow
import { race, take, put, call, fork, select, cancel } from 'redux-saga/effects';
// import keytar from 'keytar';
import Raven from 'raven-js';
import { formValueSelector } from 'redux-form';
import { ipcRenderer, remote } from 'electron';
import { types, profileActions, clearAllReducers, uiActions, settingsActions } from 'actions';
import * as Api from 'api';
import { getIsPaidUser, getHost } from 'selectors';
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
import { fetchIssueFields, fetchEpics } from './issues';
import { setToStorage, removeFromStorage } from './storage';
import { throwError, infoLog } from './ui';
import { plugSocket } from './socket';

import jira from '../utils/jiraClient';

function transformValidHost(host: string): URL {
  try {
    if (host.startsWith('localhost')) {
      return new URL(`https://${host}`);
    }
    return new URL(host);
  } catch (err) {
    if (err instanceof TypeError) {
      try {
        if (/^[a-zA-Z0-9-]*$/.test(host)) {
          const atlassianUrl = `https://${host}.atlassian.net`;
          return new URL(atlassianUrl);
        } else if (!host.match(/^(http:\/\/|https:\/\/)/)) {
          const protocolUrl = `https://${host}`;
          return new URL(protocolUrl);
        }
      } catch (err2) {
        throw new Error('Invalid Jira url');
      }
    }
    throw new Error('Invalid Jira url');
  }
}

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

function* clearLoginError(): Generator<*, void, *> {
  yield put(profileActions.throwLoginError(''));
}

function identifyInSentryAndMixpanel(host: URL, userData: User): void {
  if (process.env.DISABLE_MIXPANEL !== '1') {
    mixpanel.identify((`${host.origin} - ${userData.emailAddress}`));
    mixpanel.people.set({
      host: host.origin,
      locale: userData.locale,
      $timezone: userData.timeZone,
      $name: userData.displayName,
      $email: userData.emailAddress,
      $distinct_id: `${host.origin} - ${userData.emailAddress}`,
    });
    Raven.setUserContext({
      host: host.origin,
      locale: userData.locale,
      timeZone: userData.timeZone,
      name: userData.displayName,
      email: userData.emailAddress,
    });
  }
}

function* jiraLogin(values: AuthFormData): Generator<*, boolean, *> {
  try {
    yield call(infoLog, 'starting jira login', values);
    const userData: User = yield call(Api.jiraAuth, { ...values });
    yield call(identifyInSentryAndMixpanel, values.host, userData);
    yield put(profileActions.fillUserData(userData));
    return true;
  } catch (err) {
    yield put(profileActions.setLoginFetching(false));
    yield call(throwError, err);
    console.dir(err);
    const humanReadableError = new Error('Cannot authorize to JIRA, check credentials and try again');
    yield call(loginError, humanReadableError);
    return false;
  }
}

function* chronosBackendLogin(values: AuthFormData): Generator<*, boolean, *> {
  try {
    yield call(infoLog, 'starting chronos backend login', values);
    const isPaidUser = yield select(getIsPaidUser);
    if (!isPaidUser) {
      yield call(infoLog, 'not paid chronos user, chronosBackendLogin = true');
      return true;
    }
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
    if (userData.authType === 'OAuth') {
      yield put(profileActions.loginOAuthRequest(userData.baseUrl, {
        accessToken: userData.token,
        tokenSecret: userData.token_secret,
      }));
    } else {
      yield put(profileActions.setLoginFetching(false));
    }
  } catch (err) {
    yield put(profileActions.setLoginFetching(false));
    yield call(throwError, err);
    const humanReadableError = new Error('Failed to check JWT for some reason, please try again');
    yield call(loginError, humanReadableError);
  }
}

function* afterLogin(): Generator<*, void, *> {
  yield put(settingsActions.requestLocalDesktopSettings());
  yield put(profileActions.setLoginFetching(false));
  yield put(profileActions.setAuthorized(true));
  yield fork(fetchIssueFields);
  yield fork(fetchEpics);

  const isPaidChronosUser = yield select(getIsPaidUser);

  if (isPaidChronosUser) {
    yield fork(getSettings);
    yield fork(getWorklogTypes);
    yield fork(plugSocket);
  }
  // yield put({ type: types.CHECK_OFFLINE_SCREENSHOTS });
  // yield put({ type: types.CHECK_OFFLINE_WORKLOGS });
}

export function* loginFlow(): Generator<*, void, *> {
  while (true) {
    try {
      const { payload }: LoginRequestAction = yield take(types.LOGIN_REQUEST);
      yield call(infoLog, 'loginFlow started', payload);
      const host = yield select(getHost);
      if (!payload.host || (!(payload.host instanceof URL) && host instanceof URL)) {
        // $FlowFixMe
        payload.host = host;
      }
      yield call(clearLoginError);
      yield put(profileActions.setLoginFetching(true));
      const chronosBackendLoginSuccess: boolean = yield call(chronosBackendLogin, payload);
      if (chronosBackendLoginSuccess) {
        const jiraLoginSuccess: boolean = yield call(jiraLogin, payload);
        if (jiraLoginSuccess) {
          yield call(setToStorage, 'jira_credentials', { username: payload.username, password: '', host: payload.host.origin });
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
      yield call(clearLoginError);
      // collecting basic oAuth data
      const host: URL = yield call(transformValidHost, payload);
      const { hostname } = host;
      const oAuthData = yield call(Api.getDataForOAuth, hostname);
      let accessToken: string;
      let tokenSecret: string;
      if (meta) {
        accessToken = meta.accessToken; // eslint-disable-line
        tokenSecret = meta.tokenSecret; // eslint-disable-line
      } else {
        const { token, url, ...rest }: { token: string, url: string, tokenSecret: string } =
          yield call(Api.getOAuthUrl, { oauth: oAuthData, host: hostname });

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
          host: hostname,
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
          { baseUrl: host.hostname, token: accessToken, token_secret: tokenSecret },
        );

        yield call(setToStorage, 'desktop_tracker_jwt', data.token);
      }

      yield call(jira.oauth, {
        host: hostname,
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
    yield call(removeFromStorage, 'desktop_tracker_jwt');
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
    yield put(clearAllReducers());
    yield fork(loginFlow);
    yield fork(loginOAuthFlow);
  }
}

export function* watchSetAuthFormStep(): Generator<*, void, *> {
  while (true) {
    const { payload } = yield take(types.SET_AUTH_FORM_STEP);
    if (payload === 2) {
      const selector = state => formValueSelector('auth')(state, 'host');
      // $FlowFixMe
      const hostFormValue = yield select(selector);
      if (hostFormValue) {
        try {
          const host = yield call(transformValidHost, hostFormValue);
          yield call(setToStorage, 'jira_credentials', { host: host.href });
          const isPaidChronosUser = yield call(Api.checkUserPlan, { host: host.hostname });
          yield put(profileActions.setIsPaidUser(isPaidChronosUser));
          yield put(profileActions.setHost(host));
        } catch (err) {
          yield call(loginError, err);
          yield put(uiActions.setAuthFormStep(1));
        }
      } else {
        yield put(uiActions.setAuthFormStep(1));
      }
    }
  }
}
