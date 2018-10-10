// @flow
import {
  fork,
  take,
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

import jira from 'utils/jiraClient';
import {
  trackMixpanel,
  incrementMixpanel,
} from 'utils/stat';

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
    const { token } = yield call(
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

function storeInKeytar(payload) {
  ipcRenderer.sendSync(
    'store-credentials',
    payload,
  );
}

function* saveAccount(payload: { name: string, origin: string }): Generator<*, void, *> {
  const { name, origin } = payload;
  let accounts = yield call(getFromStorage, 'accounts');
  if (!accounts) accounts = [];
  if (!R.find(R.whereEq({ origin, name }), accounts)) {
    accounts.push(payload);
    yield call(setToStorage, 'accounts', accounts);
  }
}

function* deleteAccount(payload: { name: string, origin: string }): Generator<*, void, *> {
  const { origin, name } = payload;
  let accounts = yield call(getFromStorage, 'accounts');
  if (!accounts) accounts = [];
  const index = R.findIndex(R.whereEq({ name, origin }), accounts);
  if (index !== -1) {
    accounts = R.without([{ name, origin }], accounts);
    yield call(setToStorage, 'accounts', accounts);
  }
}

export function* authFlow(): Generator<*, *, *> {
  while (true) {
    try {
      const { payload: { host, token } } = yield take(actionTypes.AUTH_REQUEST);
      const { hostname, origin } = host;
      const protocol = host.protocol.slice(0, -1);

      yield put(authActions.addAuthDebugMessage([
        { string: 'Login request...' },
        { string: `host: ${hostname}` },
        { string: `protocol: ${protocol}` },
        { string: `port: ${host.port}` },
        { string: `path_prefix: ${host.pathname}` },
      ]));

      yield put(uiActions.setUiState('authRequestInProcess', true));

      yield call(jira.auth, {
        host,
        token,
      });

      // Test request for check auth
      const {
        debug,
        result,
      } = yield call(Api.jiraProfile, true);
      yield put(authActions.addAuthDebugMessage([
        { json: debug },
      ]));
      const { name } = result;
      yield call(
        setToStorage,
        'last_used_account',
        {
          name,
          origin,
        },
      );
      yield call(
        saveAccount,
        {
          name,
          origin,
        },
      );
      yield call(initialConfigureApp, {
        host: hostname,
        protocol,
      });
      yield call(storeInKeytar, {
        name,
        token,
        origin,
      });
      yield put(uiActions.setUiState('authRequestInProcess', false));
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
      yield put(uiActions.setUiState('authRequestInProcess', false));
      yield put(uiActions.setUiState(
        'authError',
        'Can not authenticate user. Please try again',
      ));
      yield call(throwError, err.result ? err.result : err);
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
        ipcRenderer.send(
          'remove-auth-cookies',
          lastUsedAccount.origin,
        );
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

export function* switchAccountFlow(): Generator<*, *, *> {
  while (true) {
    const { payload: { name, origin } } = yield take(actionTypes.SWITCH_ACCOUNT);
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
        const host = yield call(transformValidHost, origin);
        const {
          credentials,
          error,
        } = ipcRenderer.sendSync(
          'get-credentials',
          {
            name,
            origin,
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
          yield put(authActions.authRequest({
            host,
            token: credentials.token,
          }));
        }
      }
      trackMixpanel('SwitchAccounts');
      incrementMixpanel('SwitchAccounts', 1);
    } catch (err) {
      yield call(throwError, err);
    }
  }
}
