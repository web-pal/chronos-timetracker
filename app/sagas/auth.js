// @flow
import {
  fork,
  take,
  race,
  call,
  put,
} from 'redux-saga/effects';
import {
  ipcRenderer,
  remote,
} from 'electron';
import Raven from 'raven-js';

import * as Api from 'api';
import {
  types,
  authActions,
  clearAllReducers,
} from 'actions';

import type {
  ErrorObj,
  LoginRequestAction,
  LoginOAuthRequestAction,
} from '../types';
import jira from '../utils/jiraClient';
import {
  setToStorage,
  removeFromStorage,
} from './storage';
import {
  initialConfigureApp,
} from './initializeApp';
import createIpcChannel from './ipc';


export function transformValidHost(host: string): URL {
  try {
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

function* loginError(error: ErrorObj): Generator<*, void, *> {
  const errorMessage: string = error.message || 'Unknown error';
  yield put(authActions.throwLoginError(errorMessage));
}

function* clearLoginError(): Generator<*, void, *> {
  yield put(authActions.throwLoginError(''));
}

export function* basicAuthLoginForm(): Generator<*, void, *> {
  while (true) {
    try {
      const { payload }: LoginRequestAction = yield take(types.LOGIN_REQUEST);
      const host = yield call(transformValidHost, payload.host);
      const protocol = host.protocol.slice(0, -1);

      yield put(authActions.setLoginFetching(true));
      yield call(clearLoginError);
      yield call(
        jira.basicAuth,
        {
          ...payload,
          host: host.hostname,
          protocol,
          port: host.port,
          path_prefix: host.pathname,
        },
      );
      yield call(
        setToStorage,
        'jira_credentials',
        {
          username: payload.username,
          host: payload.host,
        },
      );
      yield call(initialConfigureApp, { host: host.hostname, protocol });
      yield call((): void => { ipcRenderer.sendSync('store-credentials', payload); });
      yield put(authActions.setLoginFetching(false));
    } catch (err) {
      yield put(authActions.setLoginFetching(false));
      const humanReadableError = new Error('Can not authenticate user. Please try again');
      yield call(loginError, humanReadableError);
      Raven.captureException(err);
    }
  }
}

export function* oAuthLoginForm(): Generator<*, void, *> {
  while (true) {
    try {
      const { payload }: LoginOAuthRequestAction = yield take(types.LOGIN_OAUTH_REQUEST);
      yield put(authActions.setLoginFetching(true));

      const host = yield call(transformValidHost, payload);
      const oAuthData = yield call(Api.getDataForOAuth, host.hostname);

      const { token, url, ...rest } = yield call(
        Api.getOAuthUrl,
        {
          oauth: oAuthData,
          host: host.hostname,
        },
      );

      // opening oAuth modal
      ipcRenderer.send('open-oauth-url', url);

      const { code, denied } = yield race({
        code: take(types.ACCEPT_OAUTH),
        denied: take(types.DENY_OAUTH),
      });

      if (denied) {
        throw new Error('OAuth denied');
      }

      // if not denied get oAuth Token
      const accessToken = yield call(Api.getOAuthToken, {
        host: host.hostname,
        oauth: {
          token,
          token_secret: rest.tokenSecret,
          oauth_verifier: code.payload,
          consumer_key: oAuthData.consumerKey,
          private_key: oAuthData.privateKey,
        },
      });

      const data = yield call(
        Api.chronosBackendOAuth,
        {
          baseUrl: host.hostname,
          token: accessToken,
          token_secret: rest.tokenSecret,
        },
      );

      yield call(jira.oauth, {
        host: host.hostname,
        oauth: {
          token: accessToken,
          token_secret: rest.tokenSecret,
          consumer_key: oAuthData.consumerKey,
          private_key: oAuthData.privateKey,
        },
      });
      yield call(setToStorage, 'desktop_tracker_jwt', data.token);
      yield call(initialConfigureApp, { host });
      yield put(authActions.setLoginFetching(false));
    } catch (err) {
      yield put(authActions.setLoginFetching(false));
      const humanReadableError = new Error('Can not authenticate user. Please try again');
      yield call(loginError, humanReadableError);
      Raven.captureException(err);
    }
  }
}


export function* logoutFlow(): Generator<*, *, *> {
  while (true) {
    yield take(types.LOGOUT_REQUEST);
    try {
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
      if (!running && !uploading) {
        yield call(removeFromStorage, 'desktop_tracker_jwt');
        yield call(removeFromStorage, 'jira_credentials');
        yield put(clearAllReducers());
      }
    } catch (err) {
      Raven.captureException(err);
      console.log(err);
    }
  }
}

function getOauthChannelListener(channel, type) {
  if (type === 'accepted') {
    return function* listenOauthAccepted() {
      while (true) {
        const ev = yield take(channel);
        try {
          yield put(authActions.acceptOAuth(ev.payload[0]));
        } catch (err) {
          console.log(err);
        }
      }
    };
  }
  return function* listenOauthDenied() {
    while (true) {
      yield take(channel);
      yield put(authActions.denyOAuth());
    }
  };
}

export function* createIpcAuthListeners(): void {
  const oAuthAcceptedChannel = yield call(createIpcChannel, 'oauth-accepted');
  const oAuthDeniedChannel = yield call(createIpcChannel, 'oauth-denied');

  yield fork(getOauthChannelListener(oAuthAcceptedChannel, 'accepted'));
  yield fork(getOauthChannelListener(oAuthDeniedChannel, 'denied'));
}
