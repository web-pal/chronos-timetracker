// @flow
import * as eff from 'redux-saga/effects';
import {
  remote,
} from 'electron';
import * as Sentry from '@sentry/electron';
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
  updaterActions,
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
    Sentry.configureScope((scope) => {
      scope.setUser({
        host,
        locale: userData.locale,
        timeZone: userData.timeZone,
        name: userData.displayName,
        email: userData.emailAddress,
      });
    });
  }
}

function* initializeMixpanel(): Generator<*, *, *> {
  if (process.env.DISABLE_MIXPANEL === '1') {
    yield eff.call(infoLog, 'mixpanel disabled with ENV var');
  }
  if (!process.env.MIXPANEL_API_TOKEN) {
    yield eff.call(throwError, 'MIXPANEL_API_TOKEN not set!');
  }
  if (
    process.env.DISABLE_MIXPANEL !== '1'
    && process.env.MIXPANEL_API_TOKEN
  ) {
    yield eff.call(
      mixpanel.init,
      process.env.MIXPANEL_API_TOKEN,
    );
    trackMixpanel('Application was initialized');
    incrementMixpanel('Initialize', 1);
  }
}

function* issueWindow(url) {
  let win = null;
  try {
    win = yield eff.call(
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
          title: 'Issue window',
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
      } = yield eff.race({
        showForm: eff.take(actionTypes.SHOW_ISSUE_FORM_WINDOW),
        currentWindowClose: eff.take(sharedActionTypes.WINDOW_BEFORE_UNLOAD),
        hideWin: eff.take(actionTypes.CLOSE_ISSUE_FORM_WINDOW),
      });
      if (showForm) {
        win.show();
      }
      if (hideWin) {
        win.hide();
      }
      if (currentWindowClose) {
        win.destroy();
      }
    }
  } finally {
    if (
      yield eff.cancelled()
      && win
    ) {
      win.destroy();
    }
  }
}

export function* takeInitialConfigureApp() {
  let issueWindowTask = null;
  while (true) {
    const {
      protocol,
      hostname,
      port,
      pathname,
      rootApiUrl,
    } = yield eff.take(actionTypes.INITIAL_CONFIGURE_APP);
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

      yield eff.put(uiActions.setUiState('protocol', protocol));
      yield eff.put(uiActions.setUiState('hostname', hostname));
      yield eff.put(uiActions.setUiState('port', port));
      yield eff.put(uiActions.setUiState('pathname', pathname));

      const baseUrl = yield eff.select(getBaseUrl);

      if (issueWindowTask) {
        yield eff.cancel(issueWindowTask);
      }
      issueWindowTask = yield eff.fork(
        issueWindow,
        `${baseUrl}/issues`,
      );

      const userData = yield eff.call(jiraApi.getMyself);

      yield eff.put(profileActions.fillUserData(userData));
      yield eff.call(initializeMixpanel);
      yield eff.call(identifyInSentryAndMixpanel, hostname, userData);

      const accounts = yield eff.call(
        getElectronStorage,
        'accounts',
        [],
      );
      const persistUiState = yield eff.call(
        getElectronStorage,
        `persistUiState_${hostname}`,
        {},
      );
      yield eff.put(uiActions.setUiState2({
        ...persistUiState,
        accounts,
      }));

      const persistSettings = yield eff.call(
        getElectronStorage,
        `localDesktopSettings_${hostname}`,
        {},
      );
      yield eff.put(
        settingsActions.fillLocalDesktopSettings(persistSettings),
      );

      yield eff.put(updaterActions.setUpdateSettings({
        autoDownload: persistSettings.updateAutomatically,
        allowPrerelease: persistSettings.updateChannel !== 'stable',
      }));
      yield eff.put(updaterActions.checkUpdates());
      yield eff.call(fetchIssueFields);
      yield eff.fork(fetchEpics);
      yield eff.fork(fetchProjects);
      yield eff.fork(fetchFilters);
      yield eff.fork(fetchBoards);

      yield eff.put(uiActions.setUiState('authorized', true));
      yield eff.put(uiActions.setUiState('authRequestInProcess', false));

      yield eff.put(resourcesActions.setResourceMeta({
        resourceType: 'issues',
        meta: {
          refetchFilterIssuesMarker: false,
        },
      }));
      yield eff.put(uiActions.setUiState('initializeInProcess', false));
    } catch (err) {
      yield err.call(throwError, err);
      yield eff.put(uiActions.setUiState('authorized', false));
      yield eff.put(uiActions.setUiState('initializeInProcess', false));
    }
  }
}

export function* initializeApp(): Generator<*, *, *> {
  yield eff.put(uiActions.setUiState('initializeInProcess', true));
  try {
    const authCredentials = yield eff.call(
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
        const cookiesStr = yield eff.call(
          keytar.getPassword,
          'Chronos',
          `${authCredentials.name}_${authCredentials.hostname}`,
        );
        const cookies = JSON.parse(cookiesStr);
        authCredentials.cookies = cookies;
      } catch (error) {
        Sentry.captureMessage('keytar error!', {
          level: 'error',
          extra: {
            error,
          },
        });
        yield eff.call(
          throwError,
          error,
        );
        if (process.platform === 'linux') {
          yield eff.fork(
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
      yield eff.call(
        jiraApi.setRootUrl,
        rootApiUrl,
      );
      yield eff.put(uiActions.initialConfigureApp({
        ...authCredentials,
        rootApiUrl,
      }));
    } else {
      yield eff.put(uiActions.setUiState('initializeInProcess', false));
    }
  } catch (err) {
    yield eff.call(throwError, err);
    yield eff.put(uiActions.setUiState('authorized', false));
    yield eff.put(uiActions.setUiState('initializeInProcess', false));
  }
}

export function* handleAttachmentWindow(): Generator<*, *, *> {
  let win = null;
  while (true) {
    const { issueId, activeIndex } = yield eff.take(actionTypes.SHOW_ATTACHMENT_WINDOW);
    const issue = yield eff.select(getResourceItemById('issues', issueId));
    if (
      !win
      || win.isDestroyed()
    ) {
      win = yield eff.call(
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
      yield eff.delay(500);
    }
    yield eff.put(issuesActions.setAttachments({
      attachments: issue?.fields?.attachment || [],
      activeIndex,
      scope: [win.id],
    }));
    win.focus();
  }
}

export function* handleQuitRequest(): Generator<*, *, *> {
  while (true) {
    yield eff.take(sharedActionTypes.QUIT_REQUEST);
    yield eff.call(savePersistStorage);
    yield eff.put(uiActions.setUiState('readyToQuit', true));
    if (process.env.NODE_ENV === 'development') {
      window.location.reload();
    } else {
      remote.app.quit();
    }
  }
}

function getDispatchActionListener(channel) {
  return function* listenReFetchIssue() {
    while (true) {
      const { payload } = yield eff.take(channel);
      yield eff.put(payload[0]);
    }
  };
}

export function* createDispatchActionListener(): Generator<*, *, *> {
  const dispatchChannel = yield eff.call(createIpcChannel, 'dispatch');
  yield eff.fork(getDispatchActionListener(dispatchChannel));
}
