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

function* saveAccount(payload: { name: string, hostname: string }): Generator<*, void, *> {
  const { name, hostname } = payload;
  let accounts = yield call(getFromStorage, 'accounts');
  if (!accounts) accounts = [];
  if (!R.find(R.whereEq({ name, hostname }), accounts)) {
    accounts.push(payload);
    yield call(setToStorage, 'accounts', accounts);
  }
}

function* deleteAccount(payload: { name: string, hostname: string }): Generator<*, void, *> {
  const { name, hostname } = payload;
  let accounts = yield call(getFromStorage, 'accounts');
  if (!accounts) accounts = [];
  const index = R.findIndex(R.whereEq({ name, hostname }), accounts);
  if (index !== -1) {
    accounts = R.remove(index, 1, accounts);
    yield call(setToStorage, 'accounts', accounts);
  }
}

export function* authSelfHostFlow(): Generator<*, *, *> {
  while (true) {
    const {
      payload: {
        username,
        password,
        host,
      },
    } = yield take(actionTypes.AUTH_SELF_HOST_REQUEST);
    try {
      yield put(uiActions.setUiState('authRequestInProcess', true));
      const { href, hostname, port, pathname } = host;
      const protocol = host.protocol.slice(0, -1);
      const cookies = yield call(Api.getAuthCookies, {
        pathname,
        protocol,
        username,
        password,
        baseUrl: href.replace(/\/$/, ''),
      });
      const data = {
        protocol,
        hostname,
        port,
        pathname,
        cookies,
      };
      yield put(authActions.authRequest(data));
    } catch (err) {
      if (err && err.message) {
        yield put(uiActions.setUiState('authError', err.message));
      } else {
        yield put(uiActions.setUiState(
          'authError',
          'Can not authenticate user. Please try again',
        ));
      }
      yield call(throwError, err);
      yield put(uiActions.setUiState('authRequestInProcess', false));
    }
  }
}

export function* authFlow(): Generator<*, *, *> {
  while (true) {
    try {
      const {
        payload: {
          protocol,
          hostname,
          port,
          pathname,
          cookies,
        },
      } = yield take(actionTypes.AUTH_REQUEST);

      yield put(authActions.addAuthDebugMessage([
        { string: 'Login request...' },
        { string: `host: ${hostname}` },
        { string: `protocol: ${protocol}` },
        { string: `port: ${port}` },
        { string: `path_prefix: ${pathname}` },
      ]));

      yield put(uiActions.setUiState('authRequestInProcess', true));

      // Try auth and get mySelf
      const { debug, result } = yield call(Api.authJira, {
        protocol,
        hostname,
        port,
        pathname,
        cookies,
      });
      yield put(authActions.addAuthDebugMessage([
        { json: debug },
      ]));
      const { name } = result;
      const account = {
        name,
        protocol,
        hostname,
        port,
        pathname,
      };
      yield call(
        setToStorage,
        'last_used_account',
        account,
      );
      yield call(
        saveAccount,
        account,
      );
      yield call(storeInKeytar, {
        name,
        protocol,
        hostname,
        cookies,
      });
      yield call(initialConfigureApp, {
        protocol,
        hostname,
        port,
        pathname,
      });
      trackMixpanel('Jira login');
      incrementMixpanel('Jira login', 1);
    } catch (err) {
      if (err.debug) {
        console.log(err.debug);
        yield put(authActions.addAuthDebugMessage([
          {
            json: err.debug,
          },
        ]));
      }
      yield put(uiActions.setUiState('authRequestInProcess', false));
      yield put(uiActions.setUiState('authFormStep', 1));
      yield put(uiActions.setUiState('authFormIsComplete', false));
      yield put(uiActions.setUiState('initializeInProcess', false));
      yield put(uiActions.setUiState('authorized', false));
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
      const lastUsedAccount = yield call(getFromStorage, 'last_used_account');
      ipcRenderer.send(
        'remove-auth-cookies',
      );
      if (!running && !uploading && !dontForget) {
        yield call(removeFromStorage, 'desktop_tracker_jwt');
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
        const {
          credentials,
          error,
        } = ipcRenderer.sendSync(
          'get-credentials',
          {
            name: payload.name,
            protocol: payload.protocol,
            hostname: payload.hostname,
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
          ipcRenderer.send(
            'remove-auth-cookies',
          );
          yield put({
            type: actionTypes.__CLEAR_ALL_REDUCERS__,
          });
          yield put(uiActions.setUiState('initializeInProcess', true));
          let accounts = yield call(getFromStorage, 'accounts');
          if (!accounts) accounts = [];
          yield put(uiActions.setUiState('accounts', accounts));
          yield put(authActions.authRequest({
            ...payload,
            ...credentials,
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
