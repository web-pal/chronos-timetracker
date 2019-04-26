// @flow
import * as eff from 'redux-saga/effects';

import Positioner from 'electron-positioner';
import path from 'path';

import {
  remote,
  screen,
} from 'electron';

import {
  actionTypes,
  uiActions,
  usersActions,
} from 'actions';

import {
  actionTypes as sharedActionTypes,
} from 'shared/actions';

import {
  windowsManagerSagas,
} from 'shared/sagas';

import {
  getUiState,
} from 'selectors';


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
  return tray;
}

function getWindowPosition({ win, tray }) {
  const windowPositioner = new Positioner(win);
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  const windowSize = win.getBounds();
  const trayBounds = tray.getBounds();

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

function displayWindow({ win, tray }) {
  const position = getWindowPosition({ win, tray });
  win.setPosition(position.x, position.y, !!process.platform === 'darwin');
  win.show();
  win.focus();
}

function* onToggleClick({
  win,
  tray,
  channel,
}) {
  while (true) {
    yield eff.take(channel);
    if (win.isVisible()) {
      tray.setHighlightMode('never');
      win.hide();
    } else {
      tray.setHighlightMode('always');
      yield eff.call(displayWindow, { win, tray });
    }
  }
}

function* onBlur({
  win,
  tray,
  channel,
}) {
  while (true) {
    yield eff.take(channel);
    tray.setHighlightMode('never');
    win.hide();
  }
}


export function* handleTeamStatusWindow(): Generator<*, *, *> {
  let win = null;
  let tray = null;
  while (true) {
    const {
      currentWindowClose,
      showWindow,
      hideWindow,
    } = yield eff.race({
      currentWindowClose: eff.take(sharedActionTypes.WINDOW_BEFORE_UNLOAD),
      showWindow: eff.take(actionTypes.SHOW_TEAM_STATUS_WINDOW),
      hideWindow: eff.take(actionTypes.HIDE_TEAM_STATUS_WINDOW),
    });
    if (
      (currentWindowClose || hideWindow)
      && win
      && !win.isDestroyed()
    ) {
      win.destroy();
      win = null;
    }
    console.log('currentWindowClose', currentWindowClose);
    console.log('hideWindow', hideWindow);
    console.log('(currentWindowClose || hideWindow)', (currentWindowClose || hideWindow));
    console.log('tray', tray);
    console.log('tray.isDestroyed()', tray?.isDestroyed());
    if (
      (currentWindowClose || hideWindow)
      && tray
      && !tray.isDestroyed()
    ) {
      console.log('*currentWindowClose', currentWindowClose);
      console.log('*tray', tray);
      console.log('*tray.isDestroyed()', tray.isDestroyed());
      console.log('*hideWindow', hideWindow);
      console.log('*destroy tray', tray);
      tray.destroy();
      tray = null;
    }
    if (showWindow) {
      yield eff.put(uiActions.setUiState({ teamStatusWindowLoading: true }));
      tray = yield eff.call(teamStatusListTrayManager);
      const users = yield eff.select(getUiState('usersInTeamStatusWindow'));
      if (
        !win
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

        const toggleChannel = windowsManagerSagas.createWindowChannel({
          win: tray,
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

        yield eff.fork(onToggleClick, {
          win,
          tray,
          channel: toggleChannel,
        });

        yield eff.fork(onBlur, {
          win,
          tray,
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
      yield eff.put(uiActions.setUiState({ teamStatusWindowLoading: false }));
    }
  }
}
