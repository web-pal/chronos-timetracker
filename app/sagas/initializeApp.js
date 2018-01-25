// @flow
import {
  call,
  put,
  fork,
} from 'redux-saga/effects';
import {
  ipcRenderer,
} from 'electron';
import Raven from 'raven-js';
import mixpanel from 'mixpanel-browser';

import * as Api from 'api';
import {
  uiActions,
  profileActions,
  projectsActions,
  authActions,
  settingsActions,
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
  transformValidHost,
} from './auth';
import {
  throwError,
  infoLog,
} from './ui';
import jira from '../utils/jiraClient';

import type {
  User,
} from '../types';


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

function* initializeMixpanel(): Generator<*, void, *> {
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
}): Generator<*, void, *> {
  const userData: User = yield call(Api.jiraProfile);

  yield call(initializeMixpanel);
  yield call(identifyInSentryAndMixpanel, host, userData);

  let settings = yield call(getFromStorage, 'localDesktopSettings');
  if (!settings || !Object.keys(settings).length) {
    settings = {
      showScreenshotPreview: true,
      screenshotPreviewTime: 15,
      nativeNotifications: true,
      updateChannel: 'stable',
      autoCheckForUpdates: true,
    };
    yield call(
      setToStorage,
      'localDesktopSettings',
      settings,
    );
  }

  // backwards compatibility
  if (!settings.updateChannel) settings.updateChannel = 'stable';
  if (!settings.autoCheckForUpdates) settings.autoCheckForUpdates = true;

  yield put(settingsActions.fillLocalDesktopSettings(settings));
  yield put(profileActions.setHost(host));
  yield put(profileActions.setProtocol(protocol));
  yield put(profileActions.fillUserData(userData));
  yield put(authActions.setAuthorized(true));

  yield fork(fetchIssueFields);
  yield fork(fetchEpics);
  yield put(projectsActions.fetchProjectsRequest());

  /*
  const isPaidChronosUser = yield select(getIsPaidUser);

  if (isPaidChronosUser) {
    yield fork(getWorklogTypes);
    yield fork(plugSocket);
  }
  */
}

function* getInitializeAppData(): Generator<*, void, *> {
  const basicAuthCredentials = yield call(
    getFromStorage,
    'jira_credentials',
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
    const passwordManagerCredentials = ipcRenderer.sendSync(
      'get-credentials',
      {
        username: basicAuthCredentials.username,
        host: host.hostname,
      },
    );
    basicAuthCredentials.password = passwordManagerCredentials.password;
  }

  const jwt = yield call(
    getFromStorage,
    'desktop_tracker_jwt',
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
    tryLogin: authType === 'OAuth' || basicAuthDataExist,
    authType,
    authData,
  };
}

export function* initializeApp(): Generator<*, void, *> {
  yield put(uiActions.setInitializeState(true));
  try {
    const {
      tryLogin,
      authType,
      authData,
    } = yield call(getInitializeAppData);
    if (tryLogin) {
      const loginFunc = authType === 'OAuth' ? jira.oauth : jira.basicAuth;
      yield call(loginFunc, authData);
      yield call(initialConfigureApp, { host: authData.host, protocol: authData.protocol });
    }
  } catch (err) {
    Raven.captureException(err);
    console.log(err);
  }
  yield put(uiActions.setInitializeState(false));
}
