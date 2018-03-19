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
import * as R from 'ramda';

import {
  actionTypes,
  authActions,
  uiActions,
} from 'actions';

import {
  setToStorage,
  getFromStorage,
  removeFromStorage,
} from './storage';
import {
  initialConfigureApp,
} from './initializeApp';
import {
  throwError,
  notify,
} from './ui';
import createIpcChannel from './ipc';

import jira from '../utils/jiraClient';
import {
  trackMixpanel,
  incrementMixpanel,
} from '../utils/stat';


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

export function* chronosBackendAuth({
  host,
  username,
  password,
  port,
  protocol,
  pathPrefix,
}: {
  host: string,
  username: string,
  password: string,
  port: string,
  protocol: string,
  pathPrefix: string,
}): Generator<*, void, *> {
  try {
    const {
      token,
    } = yield call(
      Api.chronosBackendAuth,
      {
        host,
        username,
        password,
        port,
        protocol,
        pathPrefix,
      },
    );
    yield call(
      setToStorage,
      'desktop_tracker_jwt',
      token,
    );
  } catch (err) {
    yield call(throwError, err);
  }
}

function storeInKeytar(payload, host) {
  ipcRenderer.sendSync(
    'store-credentials',
    {
      ...payload,
      host: host.hostname,
    },
  );
}

function* saveAccount(payload: { host: string, username: string }): Generator<*, void, *> {
  const { host, username } = payload;
  let accounts = yield call(getFromStorage, 'accounts');
  if (!accounts) accounts = [];
  if (!R.find(R.whereEq({ host, username }), accounts)) {
    accounts.push(payload);
    yield call(setToStorage, 'accounts', accounts);
  }
}

function* deleteAccount(payload: { host: string, username: string }): Generator<*, void, *> {
  const { host, username } = payload;
  let accounts = yield call(getFromStorage, 'accounts');
  if (!accounts) accounts = [];
  const index = R.findIndex(R.whereEq({ host, username }), accounts);
  if (index !== -1) {
    accounts = R.without([{ host, username }], accounts);
    yield call(setToStorage, 'accounts', accounts);
  }
}

export function* basicAuthLoginForm(): Generator<*, void, *> {
  while (true) {
    try {
      const { payload } = yield take(actionTypes.LOGIN_REQUEST);
      const host = yield call(transformValidHost, payload.host);
      const protocol = host.protocol.slice(0, -1);

      yield put(authActions.addAuthDebugMessage([
        { string: 'Login request...' },
        { string: `host: ${host.hostname}` },
        { string: `protocol: ${protocol}` },
        { string: `port: ${host.port}` },
        { string: `path_prefix: ${host.pathname}` },
        { string: `username: ${payload.username}` },
        { string: 'password: ***' },
      ]));

      yield put(uiActions.setUiState('loginRequestInProcess', true));
      yield put(uiActions.setUiState('loginError', null));
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
      // Test request for check auth
      const {
        debug,
        result,
      } = yield call(Api.jiraProfile, true);
      yield put(authActions.addAuthDebugMessage([
        { json: debug },
      ]));
      const userData = result;
      if (!userData.self || !userData.active) {
        Raven.captureMessage('Strange auth response!', {
          level: 'error',
          extra: {
            userData,
          },
        });
        throw new Error('Strange auth response!');
      }
      /*
      yield fork(chronosBackendAuth, {
        username: payload.username,
        password: payload.password,
        host: host.hostname,
        protocol,
        port: host.port,
        pathPrefix: host.pathname,
      });
      */
      yield call(
        setToStorage,
        'last_used_account',
        {
          username: payload.username,
          host: payload.host,
        },
      );
      yield call(
        saveAccount,
        {
          username: payload.username,
          host: payload.host,
        },
      );
      yield call(
        initialConfigureApp,
        {
          host: host.hostname,
          protocol,
        },
      );
      yield call(storeInKeytar, payload, host);
      yield put(uiActions.setUiState('loginRequestInProcess', false));
      trackMixpanel('Jira login');
      incrementMixpanel('Jira login', 1);
    } catch (err) {
      if (err.debug) {
        err.debug.options.auth.password = '***';
        err.debug.request.headers.authorization = '***';
        yield put(authActions.addAuthDebugMessage([
          {
            json: err.debug,
          },
        ]));
      }
      yield put(uiActions.setUiState('loginRequestInProcess', false));
      yield put(uiActions.setUiState(
        'loginError',
        'Can not authenticate user. Please try again',
      ));
      yield call(throwError, err.result ? err.result : err);
    }
  }
}

export function* oAuthLoginForm(): Generator<*, *, *> {
  while (true) {
    try {
      const { host } = yield take(actionTypes.LOGIN_OAUTH_REQUEST);
      yield put(uiActions.setUiState('loginRequestInProcess', true));

      const { hostname } = yield call(transformValidHost, host);
      const oAuthData = yield call(Api.getDataForOAuth, hostname);

      const {
        token,
        url,
        ...rest
      } = yield call(
        Api.getOAuthUrl,
        {
          oauth: oAuthData,
          host: hostname,
        },
      );

      // opening oAuth modal
      ipcRenderer.send('open-oauth-url', url);

      const { code, denied } = yield race({
        code: take(actionTypes.ACCEPT_OAUTH),
        denied: take(actionTypes.DENY_OAUTH),
      });

      if (denied) {
        throw new Error('OAuth denied');
      }

      // if not denied get oAuth Token
      const accessToken = yield call(Api.getOAuthToken, {
        host: hostname,
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
          baseUrl: hostname,
          token: accessToken,
          token_secret: rest.tokenSecret,
        },
      );

      yield call(jira.oauth, {
        host: hostname,
        oauth: {
          token: accessToken,
          token_secret: rest.tokenSecret,
          consumer_key: oAuthData.consumerKey,
          private_key: oAuthData.privateKey,
        },
      });
      yield call(setToStorage, 'desktop_tracker_jwt', data.token);
      yield call(initialConfigureApp, { host: hostname, protocol: 'https' });
      yield put(uiActions.setUiState('loginRequestInProcess', false));
    } catch (err) {
      yield put(uiActions.setUiState('loginRequestInProcess', false));
      yield put(uiActions.setUiState(
        'loginError',
        'Can not authenticate user. Please try again',
      ));
      yield call(throwError, err);
    }
  }
}


export function* logoutFlow(): Generator<*, *, *> {
  while (true) {
    const { payload: { dontForget } } = yield take(actionTypes.LOGOUT_REQUEST);
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
      if (!running && !uploading && !dontForget) {
        yield call(removeFromStorage, 'desktop_tracker_jwt');
        const lastUsedAccount = yield call(getFromStorage, 'last_used_account');
        yield call(deleteAccount, lastUsedAccount);
        yield call(removeFromStorage, 'last_used_account');
      }
      yield put({
        type: actionTypes.__CLEAR_ALL_REDUCERS__,
      });
      let accounts = yield call(getFromStorage, 'accounts');
      if (!accounts) accounts = [];
      yield put(uiActions.setUiState('accounts', accounts));
      trackMixpanel('Logout');
      incrementMixpanel('Logout', 1);
    } catch (err) {
      yield call(throwError, err);
    }
  }
}

function getOauthChannelListener(channel, type) {
  if (type === 'accepted') {
    return function* listenOauthAccepted(): Generator<*, *, *> {
      while (true) {
        const ev = yield take(channel);
        try {
          yield put(authActions.acceptOAuth(ev.payload[0]));
        } catch (err) {
          yield call(throwError, err);
        }
      }
    };
  }
  return function* listenOauthDenied(): Generator<*, *, *> {
    while (true) {
      yield take(channel);
      try {
        yield put(authActions.denyOAuth());
      } catch (err) {
        yield call(throwError, err);
      }
    }
  };
}

export function* switchAccountFlow(): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(actionTypes.SWITCH_ACCOUNT);
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
        const host = yield call(transformValidHost, payload.host);
        const {
          credentials,
          error,
        } = ipcRenderer.sendSync(
          'get-credentials',
          {
            username: payload.username,
            host: host.hostname,
          },
        );
        if (error) {
          Raven.captureMessage('keytar error!', {
            level: 'error',
            extra: {
              error: error.err,
            },
          });
          yield call(
            throwError,
            error.err,
          );
          if (error.platform === 'linux') {
            yield fork(
              notify,
              {
                type: 'libSecretError',
                autoDelete: false,
              },
            );
          }
        } else {
          yield put({
            type: actionTypes.__CLEAR_ALL_REDUCERS__,
          });
          yield put(uiActions.setUiState('initializeInProcess', true));
          let accounts = yield call(getFromStorage, 'accounts');
          if (!accounts) accounts = [];
          yield put(uiActions.setUiState('accounts', accounts));
          yield put(authActions.loginRequest({ ...payload, password: credentials.password }));
        }
      }
      trackMixpanel('SwitchAccounts');
      incrementMixpanel('SwitchAccounts', 1);
    } catch (err) {
      yield call(throwError, err);
    }
  }
}

export function* createIpcAuthListeners(): Generator<*, *, *> {
  const oAuthAcceptedChannel = yield call(createIpcChannel, 'oauth-accepted');
  const oAuthDeniedChannel = yield call(createIpcChannel, 'oauth-denied');

  yield fork(getOauthChannelListener(oAuthAcceptedChannel, 'accepted'));
  yield fork(getOauthChannelListener(oAuthDeniedChannel, 'denied'));
}
