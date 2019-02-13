// @flow
import {
  call,
  put,
  take,
  race,
  fork,
  select,
  delay,
} from 'redux-saga/effects';
import {
  remote,
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
import {
  getBaseUrl,
  getResourceItemById,
} from 'selectors';

import {
  actionTypes,
  uiActions,
  profileActions,
  settingsActions,
  resourcesActions,
  issuesActions,
} from 'actions';
import config from 'config';
import {
  getPreload,
} from 'utils/preload';
import {
  windowsManagerSagas,
} from 'shared/sagas';
import {
  actionTypes as sharedActionTypes,
} from 'shared/actions';

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
import {
  getElectronStorage,
  savePersistStorage,
} from './helpers';
import createIpcChannel from './ipc';
import {
  version,
} from '../../package.json';

const keytar = remote.require('keytar');

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

function* issueWindow(url) {
  const win = yield call(
    windowsManagerSagas.forkNewWindow,
    {
      url,
      showOnReady: false,
      BrowserWindow: remote.BrowserWindow,
      options: {
        backgroundColor: 'white',
        show: false,
        modal: true,
        parent: remote.getCurrentWindow(),
        useContentSize: true,
        center: true,
        title: 'Chronos',
        webPreferences: {
          nodeIntegration: false,
          preload: getPreload('issueFormPreload'),
          devTools: (
            config.issueWindowDevTools
            || process.env.DEBUG_PROD === 'true'
          ),
        },
      },
    },
  );
  while (true) {
    const {
      showForm,
      currentWindowClose,
      hideWin,
    } = yield race({
      showForm: take(actionTypes.SHOW_ISSUE_FORM_WINDOW),
      currentWindowClose: take(sharedActionTypes.WINDOW_BEFORE_UNLOAD),
      hideWin: take(actionTypes.CLOSE_ISSUE_FORM_WINDOW),
    });
    if (showForm) {
      win.show();
    }
    if (hideWin) {
      win.hide();
    }
    if (currentWindowClose) {
      yield call(savePersistStorage);
      win.destroy();
    }
  }
}

export function* takeInitialConfigureApp() {
  let issueWindowForkId = null;
  while (true) {
    const {
      protocol,
      hostname,
      port,
      pathname,
      rootApiUrl,
    } = yield take(actionTypes.INITIAL_CONFIGURE_APP);
    try {
      const filter = {
        urls: [`${rootApiUrl}/*`],
      };
      remote.session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        /* eslint-disable */
        details.requestHeaders.referer = 'electron://chronos-timetracker';
        details.requestHeaders.Origin = 'electron://chronos-timetracker';
        details.requestHeaders['User-Agent'] = 'chronos-timetracker';
        /* eslint-enable */
        callback({ cancel: false, requestHeaders: details.requestHeaders });
      });

      yield put(uiActions.setUiState('protocol', protocol));
      yield put(uiActions.setUiState('hostname', hostname));
      yield put(uiActions.setUiState('port', port));
      yield put(uiActions.setUiState('pathname', pathname));

      const baseUrl = yield select(getBaseUrl);

      if (!issueWindowForkId) {
        issueWindowForkId = yield fork(
          issueWindow,
          `${baseUrl}/issues`,
        );
      }

      const userData = yield call(jiraApi.getMyself);

      yield put(profileActions.fillUserData(userData));
      yield call(initializeMixpanel);
      yield call(identifyInSentryAndMixpanel, hostname, userData);

      const accounts = yield call(
        getElectronStorage,
        'accounts',
        [],
      );
      const persistUiState = yield call(
        getElectronStorage,
        `persistUiState_${hostname}`,
        {},
      );
      yield put(uiActions.setUiState2({
        ...persistUiState,
        accounts,
      }));

      const persistSettings = yield call(
        getElectronStorage,
        `localDesktopSettings_${hostname}`,
        {},
      );
      yield put(
        settingsActions.fillLocalDesktopSettings(persistSettings),
      );

      yield call(fetchIssueFields);
      yield fork(fetchEpics);
      yield fork(fetchProjects);
      yield fork(fetchFilters);
      yield fork(fetchBoards);

      yield put(uiActions.setUiState('authorized', true));
      yield put(uiActions.setUiState('authRequestInProcess', false));

      yield put(resourcesActions.setResourceMeta({
        resourceType: 'issues',
        meta: {
          refetchFilterIssuesMarker: false,
        },
      }));
      yield put(uiActions.setUiState('initializeInProcess', false));
    } catch (err) {
      yield call(throwError, err);
      yield put(uiActions.setUiState('authorized', false));
      yield put(uiActions.setUiState('initializeInProcess', false));
    }
  }
}

export function* initializeApp(): Generator<*, *, *> {
  yield put(uiActions.setUiState('initializeInProcess', true));
  try {
    const authCredentials = yield call(
      getElectronStorage,
      'last_used_account',
    );
    const authDataExist = (
      authCredentials !== null
      && authCredentials.name
      && authCredentials.protocol
      && authCredentials.hostname
    );
    if (authDataExist) {
      try {
        const cookiesStr = yield call(
          keytar.getPassword,
          'Chronos',
          `${authCredentials.name}_${authCredentials.hostname}`,
        );
        const cookies = JSON.parse(cookiesStr);
        authCredentials.cookies = cookies;
      } catch (error) {
        Raven.captureMessage('keytar error!', {
          level: 'error',
          extra: {
            error,
          },
        });
        yield call(
          throwError,
          error,
        );
        if (process.platform === 'linux') {
          yield fork(
            notify,
            {
              type: 'libSecretError',
              autoDelete: false,
            },
          );
        }
      }
    }
    if (
      authCredentials
      && authCredentials.cookies
    ) {
      const {
        port,
        protocol,
        hostname,
        pathname,
      } = authCredentials;
      const p = port ? `:${port}` : '';
      const rootApiUrl = `${protocol}://${hostname}${p}${pathname.replace(/\/$/, '')}`;
      yield call(
        jiraApi.setRootUrl,
        rootApiUrl,
      );
      yield put(uiActions.initialConfigureApp({
        ...authCredentials,
        rootApiUrl,
      }));
    } else {
      yield put(uiActions.setUiState('initializeInProcess', false));
    }
    trackMixpanel('Application was initialized');
    incrementMixpanel('Initialize', 1);
  } catch (err) {
    yield call(throwError, err);
    yield put(uiActions.setUiState('authorized', false));
    yield put(uiActions.setUiState('initializeInProcess', false));
  }
}

export function* handleAttachmentWindow(): Generator<*, *, *> {
  let win = null;
  while (true) {
    const { issueId } = yield take(actionTypes.SHOW_ATTACHMENT_WINDOW);
    const issue = yield select(getResourceItemById('issues', issueId));
    if (
      !win
      || win.isDestroyed()
    ) {
      win = yield call(
        windowsManagerSagas.forkNewWindow,
        {
          url: (
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:3000/attachmentWindow.html'
              : `file://${__dirname}/attachmentWindow.html`
          ),
          showOnReady: true,
          BrowserWindow: remote.BrowserWindow,
          options: {
            show: true,
            title: 'Attachments',
            webPreferences: {
              devTools: true,
            },
          },
        },
      );
      yield delay(500);
    }
    yield put(issuesActions.setAttachments({
      attachments: issue?.fields?.attachment || [],
      scope: [win.id],
    }));
    win.focus();
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
