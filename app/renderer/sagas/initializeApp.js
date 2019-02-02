// @flow
import {
  call,
  put,
  take,
  fork,
  select,
} from 'redux-saga/effects';
import {
  ipcRenderer,
} from 'electron';
import Raven from 'raven-js';
import mixpanel from 'mixpanel-browser';

import {
  jiraApi,
} from 'api';

import {
  trackMixpanel,
  incrementMixpanel,
} from 'utils/stat';
import type {
  Id,
} from 'types';
import {
  getBaseUrl,
} from 'selectors';

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
  fetchFilters,
} from './filters';
import {
  fetchBoards,
} from './boards';
import {
  throwError,
  infoLog,
  notify,
} from './ui';
import createIpcChannel from './ipc';
import {
  version,
} from '../../package.json';


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
  protocol,
  hostname,
  port,
  pathname,
}: {
  protocol: string,
  hostname: string,
  port: number | string,
  pathname: string,
}): Generator<*, *, *> {
  yield put(uiActions.setUiState('protocol', protocol));
  yield put(uiActions.setUiState('hostname', hostname));
  yield put(uiActions.setUiState('port', port));
  yield put(uiActions.setUiState('pathname', pathname));

  const baseUrl = yield select(getBaseUrl);
  ipcRenderer.send(
    'load-issue-window',
    `${baseUrl}/issues`,
  );
  const userData = yield call(jiraApi.getMyself);

  yield put(profileActions.fillUserData(userData));
  yield call(initializeMixpanel);
  yield call(identifyInSentryAndMixpanel, hostname, userData);

  let accounts = yield call(getFromStorage, 'accounts');
  if (!accounts) {
    accounts = [];
  } else {
    // check old account format
    accounts = accounts.filter((account) => {
      if (account.username || account.origin) {
        return false;
      }
      return true;
    });
  }
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
      allowEmptyComment: true,
      updateAutomatically: false,
      showLoggedOnStop: false,
    };
    yield call(
      setToStorage,
      'localDesktopSettings',
      settings,
    );
  } else if (settings.allowEmptyComment === undefined) {
    settings.allowEmptyComment = true;
    yield call(
      setToStorage,
      'localDesktopSettings',
      settings,
    );
  }


  yield call(fetchIssueFields);
  yield fork(fetchEpics);
  yield fork(fetchProjects);
  yield fork(fetchFilters);
  yield fork(fetchBoards);

  yield put(uiActions.setUiState('issuesSourceId', issuesSourceId));
  yield put(uiActions.setUiState('issuesSprintId', issuesSprintId));
  yield put(uiActions.setUiState('issuesSourceType', issuesSourceType));
  if (issuesFilters) {
    yield put(uiActions.setUiState('issuesFilters', issuesFilters));
  }

  yield put(settingsActions.fillLocalDesktopSettings(settings));
  yield put(uiActions.setUiState('authorized', true));
  yield put(uiActions.setUiState('authRequestInProcess', false));

  yield put(resourcesActions.setResourceMeta({
    resourceType: 'issues',
    meta: {
      refetchFilterIssuesMarker: false,
    },
  }));
  yield put(uiActions.setUiState('initializeInProcess', false));
}

function* getInitializeAppData(): Generator<*, *, *> {
  const authCredentials = yield call(
    getFromStorage,
    'last_used_account',
  );
  const authDataExist = authCredentials !== null
    && authCredentials.name
    && authCredentials.protocol
    && authCredentials.hostname;
  if (authDataExist) {
    const {
      credentials,
      error,
    } = ipcRenderer.sendSync(
      'get-credentials',
      {
        name: authCredentials.name,
        protocol: authCredentials.protocol,
        hostname: authCredentials.hostname,
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
    }

    authCredentials.cookies = credentials.cookies;
  }

  return authCredentials;
}

export function* initializeApp(): Generator<*, *, *> {
  yield put(uiActions.setUiState('initializeInProcess', true));
  try {
    const accounts = yield call(getFromStorage, 'accounts');

    if (accounts && accounts.some(a => a.username || a.origin)) {
      yield fork(notify, {
        title: 'New authentication system.',
        description: "We've rewritten authentication system, unfortunately, all previously saved sessions is not valid anymore. You have to re-login.",
      });
      yield call(
        setToStorage,
        'accounts',
        accounts.filter(a => (!(a.username || a.origin))),
      );
    }
    const appData = yield call(getInitializeAppData);
    if (appData && appData.cookies) {
      yield call([jiraApi, 'setAuthHeaders'], appData);
      yield call(initialConfigureApp, appData);
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
      const { payload } = yield take(channel);
      yield put(payload[0]);
    }
  };
}

export function* createDispatchActionListener(): Generator<*, *, *> {
  const dispatchChannel = yield call(createIpcChannel, 'dispatch');
  yield fork(getDispatchActionListener(dispatchChannel));
}
