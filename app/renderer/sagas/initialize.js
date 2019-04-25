// @flow
import * as eff from 'redux-saga/effects';

import {
  remote,
  screen,
} from 'electron';
import * as Sentry from '@sentry/electron';
import mixpanel from 'mixpanel-browser';

import Positioner from 'electron-positioner';
import path from 'path';

import {
  jiraApi,
  chronosApi,
} from 'api';

import {
  trackMixpanel,
  incrementMixpanel,
} from 'utils/stat';
import {
  getBaseUrl,
  getResourceItemById,
  getUiState,
} from 'selectors';

import {
  actionTypes,
  uiActions,
  profileActions,
  resourcesActions,
  issuesActions,
  updaterActions,
  usersActions,
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
  fetchSprints,
} from './sprints';
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

function teamStatusListTrayManager() {
  const { app } = remote;
  const appPath = app.getAppPath();
  function getIconByName(name) {
    if (process.env.NODE_ENV === 'development') {
      return path.join(
        appPath.split('node_modules')[0],
        `./app/renderer/assets/images/${name}.png`,
      );
    }
    return path.join(
      appPath.split('node_modules')[0],
      `./app/dist/app/renderer/assets/images/${name}.png`,
    );
  }
  const { Tray } = remote;
  const tray = new Tray(getIconByName('peopleGroup'));
  tray.setToolTip('Chronos Team Status');
  global.teamStatusListTray = tray;
}

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

/* It needs only for a screenshots functionality */
export function* chronosApiAuth(ignoreCheckEnabled = false) {
  try {
    const screenshotsEnabled = yield eff.select(getUiState('screenshotsEnabled'));
    const authCredentials = yield eff.call(
      getElectronStorage,
      'last_used_account',
    );
    const {
      name,
      hostname,
      protocol,
    } = authCredentials;
    let jwt = yield eff.call(
      keytar.getPassword,
      'ChronosJWT',
      `${name}_${hostname}`,
    );
    if (
      ignoreCheckEnabled
     || screenshotsEnabled
    ) {
      const cookiesStr = yield eff.call(
        keytar.getPassword,
        'Chronos',
        `${authCredentials.name}_${authCredentials.hostname}`,
      );
      const cookies = JSON.parse(cookiesStr);
      const res = yield eff.call(
        chronosApi.getJWT,
        {
          body: {
            cookies,
            name,
            hostname,
            protocol,
          },
        },
      );
      jwt = res.jwtToken;
      yield eff.call(
        keytar.setPassword,
        'ChronosJWT',
        `${name}_${hostname}`,
        jwt,
      );
    }
    yield eff.call(
      chronosApi.setJWT,
      jwt,
    );
  } catch (err) {
    yield eff.fork(
      notify,
      {
        icon: 'errorIcon',
        autoDelete: true,
        title: 'Enable screenshots error!',
      },
    );
    yield eff.put(uiActions.setUiState({
      screenshotsEnabled: false,
    }));
    yield eff.call(throwError, err);
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
            webSecurity: false,
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
        hideWin,
        currentWindowClose,
      } = yield eff.race({
        showForm: eff.take(actionTypes.SHOW_ISSUE_FORM_WINDOW),
        hideWin: eff.take(actionTypes.CLOSE_ISSUE_FORM_WINDOW),
        currentWindowClose: eff.take(sharedActionTypes.WINDOW_BEFORE_UNLOAD),
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

      yield eff.put(uiActions.setUiState({
        protocol,
        hostname,
        port,
        pathname,
      }));

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
      yield eff.put(uiActions.setUiState({
        ...persistUiState,
        accounts,
      }));

      yield eff.put(updaterActions.setUpdateSettings({
        autoDownload: persistUiState.updateAutomatically,
        allowPrerelease: persistUiState.updateChannel !== 'stable',
      }));
      yield eff.put(updaterActions.checkUpdates());
      const boardsTask = yield eff.fork(fetchBoards);
      yield eff.call(fetchIssueFields);
      yield eff.fork(fetchEpics);
      yield eff.fork(fetchProjects);
      yield eff.fork(fetchFilters);

      yield eff.join(boardsTask);
      yield eff.fork(fetchSprints);

      yield eff.fork(
        chronosApiAuth,
        true,
      );
      yield eff.put(uiActions.setUiState({
        authorized: true,
        authRequestInProcess: false,
      }));
      yield eff.put(resourcesActions.setResourceMeta({
        resourceType: 'issues',
        meta: {
          refetchFilterIssuesMarker: false,
        },
      }));

      yield eff.call(teamStatusListTrayManager);
      yield eff.put(usersActions.showTeamStatusWindow());

      yield eff.put(uiActions.setUiState({
        initializeInProcess: false,
      }));
    } catch (err) {
      yield eff.call(throwError, err);
      yield eff.put(uiActions.setUiState({
        authorized: false,
        initializeInProcess: false,
      }));
    }
  }
}

export function* initializeApp(): Generator<*, *, *> {
  yield eff.put(uiActions.setUiState({
    initializeInProcess: true,
  }));
  try {
    const accounts = yield eff.call(
      getElectronStorage,
      'accounts',
      [],
    );
    yield eff.put(uiActions.setUiState({
      accounts,
    }));
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
      yield eff.put(uiActions.setUiState({
        initializeInProcess: false,
      }));
    }
  } catch (err) {
    yield eff.call(throwError, err);
    yield eff.put(uiActions.setUiState({
      authorized: false,
      initializeInProcess: false,
    }));
  }
}

export function* handleAttachmentWindow(): Generator<*, *, *> {
  let win = null;
  while (true) {
    const {
      currentWindowClose,
      showWindow,
    } = yield eff.race({
      currentWindowClose: eff.take(sharedActionTypes.WINDOW_BEFORE_UNLOAD),
      showWindow: eff.take(actionTypes.SHOW_ATTACHMENT_WINDOW),
    });
    if (
      currentWindowClose
      && win
      && !win.isDestroyed()
    ) {
      win.destroy();
    }
    if (showWindow) {
      const {
        issueId,
        activeIndex,
      } = showWindow;
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
                webSecurity: false,
                devTools: (
                  config.attachmentsWindowDevtools
                  || process.env.DEBUG_PROD === 'true'
                ),
              },
            },
          },
        );
        const readyChannel = yield eff.call(
          windowsManagerSagas.createWindowChannel,
          {
            win,
            webContentsEvents: [
              'dom-ready',
            ],
          },
        );
        yield eff.take(readyChannel);
      }
      yield eff.put(issuesActions.setAttachments({
        attachments: issue?.fields?.attachment || [],
        activeIndex,
        scope: [win.id],
      }));
      win.focus();
    }
  }
}

function* onClose({
  win,
  channel,
}) {
  while (true) {
    const { data } = yield eff.take(channel);
    const { willQuitApp } = yield eff.select(state => state.windowsManager);
    if (
      !willQuitApp
      && process.platform === 'darwin'
    ) {
      data.preventDefault();
      win.hide();
    }
  }
}

function getWindowPosition(window) {
  const windowPositioner = new Positioner(window);
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  const windowSize = window.getBounds();
  const trayBounds = global.teamStatusListTray.getBounds();

  const windowLength = (trayBounds.x + (trayBounds.width / 2)) + windowSize.width;
  const windowOutOfBounds = (windowLength > screenSize.width);

  const halfScreenWidth = screenSize.width / 2;
  const halfScreenHeight = screenSize.height / 2;

  const calculateWindowPosition = trayPosition => (offset) => {
    const { x, y } = windowPositioner.calculate(trayPosition, trayBounds);
    return { x: x + offset.x, y: y + offset.y };
  };

  const calculateOffsetCenter = calculateWindowPosition('trayCenter');
  const calculateOffsetBottomLeft = calculateWindowPosition('trayBottomLeft');
  const calculateOffsetBottomCenter = calculateWindowPosition('trayBottomCenter');
  const calculateOffsetTopRight = calculateWindowPosition('topRight');

  if (process.platform === 'win32') {
    // Vertical or Horizontal Taskbar
    if ((trayBounds.x + trayBounds.width) <= halfScreenWidth) {
      // left
      if (windowOutOfBounds) {
        return calculateOffsetBottomLeft({ x: -7, y: 0 });
      }
      return calculateOffsetBottomLeft({ x: 78, y: -10 });
    }

    if ((trayBounds.x + trayBounds.width) >= halfScreenWidth) {
      if ((trayBounds.y + trayBounds.height) <= halfScreenHeight) {
        // top
        if (windowOutOfBounds) {
          return calculateOffsetCenter({ x: -7, y: 0 });
        }
        return calculateOffsetCenter({ x: 0, y: 8 });
      }
      // bottom or right
      if (windowOutOfBounds) {
        return calculateOffsetBottomCenter({ x: -7, y: 0 });
      }
      return calculateOffsetBottomCenter({ x: 0, y: -6 });
    }
  }
  if (process.platform === 'darwin') {
    if (windowOutOfBounds) {
      return calculateOffsetCenter({ x: -20, y: 0 });
    }
    return calculateOffsetCenter({ x: 0, y: 3 });
  }

  if (windowOutOfBounds) {
    return calculateOffsetTopRight({ x: -20, y: 0 });
  }
  return calculateOffsetTopRight({ x: -10, y: 5 });
}

function displayWindow(window) {
  const position = getWindowPosition(window);
  window.setPosition(position.x, position.y, !!process.platform === 'darwin');
  window.show();
  window.focus();
}

function* onToggleClick({
  win,
  channel,
}) {
  while (true) {
    yield eff.take(channel);
    if (win.isVisible()) {
      global.teamStatusListTray.setHighlightMode('never');
      win.hide();
    } else {
      global.teamStatusListTray.setHighlightMode('always');
      yield eff.call(displayWindow, win);
    }
  }
}

function* onBlur({
  win,
  channel,
}) {
  while (true) {
    yield eff.take(channel);
    global.teamStatusListTray.setHighlightMode('never');
    win.hide();
  }
}


export function* handleTeamStatusWindow(): Generator<*, *, *> {
  let win = null;
  while (true) {
    const {
      currentWindowClose,
      showWindow,
    } = yield eff.race({
      currentWindowClose: eff.take(sharedActionTypes.WINDOW_BEFORE_UNLOAD),
      showWindow: eff.take(actionTypes.SHOW_TEAM_STATUS_WINDOW),
    });
    if (
      currentWindowClose
      && win
      && !win.isDestroyed()
    ) {
      win.destroy();
    }
    if (showWindow) {
      const users = yield eff.select(getUiState('usersInTeamStatusWindow'));
      if (
        !win
        || win.isDestroyed()
      ) {
        win = yield eff.call(
          windowsManagerSagas.forkNewWindow,
          {
            url: (
              process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000/teamStatusList.html'
                : `file://${__dirname}/teamStatusList.html`
            ),
            BrowserWindow: remote.BrowserWindow,
            options: {
              show: false,
              width: 330,
              height: 335,
              minWidth: 330,
              minHeight: 335,
              fullscreenable: false,
              resizable: false,
              transparent: true,
              skipTaskbar: true,
              alwaysOnTop: true,
              frame: false,
              webPreferences: {
                webSecurity: false,
                devTools: (
                  process.env.NODE_ENV === 'development'
                  || process.env.DEBUG_PROD === 'true'
                ),
              },
            },
          },
        );
        const readyChannel = yield eff.call(
          windowsManagerSagas.createWindowChannel,
          {
            win,
            webContentsEvents: [
              'dom-ready',
            ],
          },
        );

        const closeChannel = windowsManagerSagas.createWindowChannel({
          win,
          events: [
            'close',
          ],
        });

        const toggleChannel = windowsManagerSagas.createWindowChannel({
          win: global.teamStatusListTray,
          events: [
            'click',
          ],
        });

        const blurChannel = windowsManagerSagas.createWindowChannel({
          win,
          events: [
            'blur',
          ],
        });
        yield eff.take(readyChannel);

        yield eff.fork(onClose, {
          win,
          channel: closeChannel,
        });

        yield eff.fork(onToggleClick, {
          win,
          channel: toggleChannel,
        });

        yield eff.fork(onBlur, {
          win,
          channel: blurChannel,
        });
      }

      yield eff.put(uiActions.setUiState({
        teamStatusWindowId: win.id,
      }));

      yield eff.put(usersActions.setTeamStatusUsers({
        teamStatusUsers: users,
        scope: win.id,
      }));
      win.focus();
    }
  }
}

export function* handleQuitRequest(): Generator<*, *, *> {
  while (true) {
    yield eff.take(sharedActionTypes.QUIT_REQUEST);
    yield eff.call(savePersistStorage);
    yield eff.put(uiActions.setUiState({
      readyToQuit: true,
    }));
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
