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

import * as Api from 'api';

import {
  actionTypes,
  authActions,
  uiActions,
} from 'actions';

import {
  setToStorage,
  removeFromStorage,
} from './storage';
import {
  initialConfigureApp,
} from './initializeApp';
import {
  throwError,
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

export function* basicAuthLoginForm(): Generator<*, void, *> {
  while (true) {
    try {
      const { payload } = yield take(actionTypes.LOGIN_REQUEST);
      const host = yield call(transformValidHost, payload.host);
      const protocol = host.protocol.slice(0, -1);

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
      const {
        token,
      } = yield call(
        Api.chronosBackendAuth,
        {
          ...payload,
          host: host.hostname,
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
      yield call(
        setToStorage,
        'desktop_tracker_jwt',
        token,
      );
      yield call(
        initialConfigureApp,
        {
          host: host.hostname,
          protocol,
        },
      );
      yield call(
        (): void => {
          ipcRenderer.sendSync(
            'store-credentials',
            {
              ...payload,
              host: host.hostname,
            },
          );
        },
      );
      yield put(uiActions.setUiState('loginRequestInProcess', false));
      trackMixpanel('Jira login');
      incrementMixpanel('Jira login', 1);
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
    yield take(actionTypes.LOGOUT_REQUEST);
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
      }
      yield put({
        type: actionTypes.__CLEAR_ALL_REDUCERS__,
      });
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

export function* createIpcAuthListeners(): Generator<*, *, *> {
  const oAuthAcceptedChannel = yield call(createIpcChannel, 'oauth-accepted');
  const oAuthDeniedChannel = yield call(createIpcChannel, 'oauth-denied');

  yield fork(getOauthChannelListener(oAuthAcceptedChannel, 'accepted'));
  yield fork(getOauthChannelListener(oAuthDeniedChannel, 'denied'));
}
