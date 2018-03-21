// @flow
import {
  call,
  put,
  take,
  fork,
} from 'redux-saga/effects';
import {
  ipcRenderer,
} from 'electron';
import Raven from 'raven-js';
import mixpanel from 'mixpanel-browser';

import * as Api from 'api';

import type {
  Id,
} from 'types';

import {
  uiActions,
  profileActions,
  settingsActions,
  resourcesActions,
} from 'actions';

import {
  getFromStorage,
  setToStorage,
} from './storage';
import {
  fetchIssueFields,
  fetchEpics,
} from './issues';
import {
  fetchProjects,
} from './projects';
import {
  fetchBoards,
} from './boards';
import {
  transformValidHost,
} from './auth';
import {
  throwError,
  infoLog,
  notify,
} from './ui';
import createIpcChannel from './ipc';

import jira from '../utils/jiraClient';
import {
  trackMixpanel,
  incrementMixpanel,
} from '../utils/stat';
import {
  version,
} from '../package.json';


function identifyInSentryAndMixpanel(host: string, userData: any): void {
  if (process.env.DISABLE_MIXPANEL !== '1') {
    mixpanel.identify((`${host} - ${userData.emailAddress}`));
    mixpanel.people.set({
      host,
      version,
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
}

function* initializeMixpanel(): Generator<*, *, *> {
  if (process.env.DISABLE_MIXPANEL === '1') {
    yield call(infoLog, 'mixpanel disabled with ENV var');
  }
  if (!process.env.MIXPANEL_API_TOKEN) {
    yield call(throwError, 'MIXPANEL_API_TOKEN not set!');
  }
  if (process.env.DISABLE_MIXPANEL !== '1' && process.env.MIXPANEL_API_TOKEN) {
    yield call(mixpanel.init, process.env.MIXPANEL_API_TOKEN);
  }
}

export function* initialConfigureApp({
  host,
  protocol,
}: {
  host: string,
  protocol: string,
}): Generator<*, *, *> {
  ipcRenderer.send(
    'load-issue-window',
    `${protocol}://${host}/issues`,
  );

  const userData = yield call(Api.jiraProfile);

  yield put(profileActions.fillUserData(userData));
  yield put(uiActions.setUiState('host', host));
  yield call(initializeMixpanel);
  yield call(identifyInSentryAndMixpanel, host, userData);

  let accounts = yield call(getFromStorage, 'accounts');
  if (!accounts) accounts = [];
  yield put(uiActions.setUiState('accounts', accounts));

  let acknowlegdedFeatures = yield call(getFromStorage, 'acknowlegdedFeatures');
  if (!acknowlegdedFeatures) acknowlegdedFeatures = [];
  yield put(uiActions.setUiState('acknowlegdedFeatures', acknowlegdedFeatures));

  const issuesSourceId: Id | null = yield call(getFromStorage, 'issuesSourceId');
  const issuesSourceType = yield call(getFromStorage, 'issuesSourceType');
  const issuesSprintId: Id | null = yield call(getFromStorage, 'issuesSprintId');
  const issuesFilters = yield call(getFromStorage, 'issuesFilters');

  let settings = yield call(getFromStorage, 'localDesktopSettings');
  if (!settings || !Object.keys(settings).length) {
    settings = {
      autoCheckForUpdates: true,
      nativeNotifications: true,
      showScreenshotPreview: true,
      screenshotPreviewTime: 15,
      trayShowTimer: true,
      updateChannel: 'stable',
    };
    yield call(
      setToStorage,
      'localDesktopSettings',
      settings,
    );
  }

  yield call(fetchIssueFields);
  yield fork(fetchEpics);
  yield fork(fetchProjects);
  yield fork(fetchBoards);

  yield put(uiActions.setUiState('issuesSourceId', issuesSourceId));
  yield put(uiActions.setUiState('issuesSprintId', issuesSprintId));
  yield put(uiActions.setUiState('issuesSourceType', issuesSourceType));
  if (issuesFilters) {
    yield put(uiActions.setUiState('issuesFilters', issuesFilters));
  }

  yield put(settingsActions.fillLocalDesktopSettings(settings));
  yield put(uiActions.setUiState('protocol', protocol));
  yield put(uiActions.setUiState('authorized', true));

  yield put(resourcesActions.setResourceMeta({
    resourceName: 'issues',
    meta: {
      refetchFilterIssuesMarker: false,
    },
  }));
  yield put(uiActions.setUiState('initializeInProcess', false));
  /*
  const isPaidChronosUser = yield select(getIsPaidUser);

  if (isPaidChronosUser) {
    yield fork(getWorklogTypes);
    yield fork(plugSocket);
  }
  */
}

function* getInitializeAppData(): Generator<*, *, *> {
  const basicAuthCredentials = yield call(
    getFromStorage,
    'last_used_account',
  );
  const basicAuthDataExist =
    basicAuthCredentials !== null &&
    basicAuthCredentials.username &&
    basicAuthCredentials.host;
  if (basicAuthDataExist) {
    const host = yield call(transformValidHost, basicAuthCredentials.host);
    basicAuthCredentials.host = host.hostname;
    basicAuthCredentials.protocol = host.protocol.slice(0, -1);
    basicAuthCredentials.port = host.port;
    basicAuthCredentials.path_prefix = host.pathname;
    const {
      credentials,
      error,
    } = ipcRenderer.sendSync(
      'get-credentials',
      {
        username: basicAuthCredentials.username,
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
      basicAuthCredentials.password = credentials.password;
    }
  }

  const jwt = yield call(
    getFromStorage,
    'jira_jwt',
  );
  let oAuthCredentials = {};
  if (jwt) {
    const oAuthData = yield call(
      Api.getDataForOAuth,
      basicAuthCredentials.host,
    );
    const oAuthAdditionalData = yield call(
      Api.chronosBackendGetJiraCredentials,
    );
    oAuthCredentials = {
      host: oAuthAdditionalData.baseUrl,
      oauth: {
        token: oAuthAdditionalData.token,
        token_secret: oAuthAdditionalData.token_secret,
        consumer_key: oAuthData.consumerKey,
        private_key: oAuthData.privateKey,
      },
    };
  }

  const authType = jwt ? 'OAuth' : 'Basic';
  const authData = jwt ?
    oAuthCredentials :
    basicAuthCredentials;

  return {
    tryLogin: authType === 'OAuth' || (basicAuthDataExist && basicAuthCredentials.password),
    authType,
    authData,
  };
}

export function* initializeApp(): Generator<*, *, *> {
  yield put(uiActions.setUiState('initializeInProcess', true));
  try {
    const {
      tryLogin,
      authType,
      authData,
    } = yield call(getInitializeAppData);

    let accounts = yield call(getFromStorage, 'accounts');
    if (!accounts) accounts = [];
    yield put(uiActions.setUiState('accounts', accounts));

    if (tryLogin) {
      const loginFunc =
        authType === 'OAuth' ? jira.oauth : jira.basicAuth;
      yield call(loginFunc, authData);
      yield call(
        initialConfigureApp,
        {
          host: authData.host,
          protocol: authData.protocol,
        },
      );
    }
    trackMixpanel('Application was initialized');
    incrementMixpanel('Initialize', 1);
  } catch (err) {
    yield call(throwError, err);
    yield put(uiActions.setUiState('authorized', false));
  } finally {
    yield put(uiActions.setUiState('initializeInProcess', false));
  }
}


function getDispatchActionListener(channel) {
  return function* listenReFetchIssue() {
    while (true) {
      const {
        payload,
      } = yield take(channel);
      yield put(payload[0]);
    }
  };
}

export function* createDispatchActionListener(): Generator<*, *, *> {
  const dispatchChannel = yield call(createIpcChannel, 'dispatch');
  yield fork(getDispatchActionListener(dispatchChannel));
}
