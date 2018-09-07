import {
  select,
  put,
  take,
  spawn,
  race,
} from 'redux-saga/effects';
import {
  eventChannel,
} from 'redux-saga';

import {
  actionTypes,
  windowsManagerActions,
} from 'shared/actions';

export function* onEventLogger({
  windowId,
  channel,
  scope,
}) {
  while (true) {
    const {
      res,
      unload,
    } = yield race({
      res: take(channel),
      unload: take(actionTypes.WINDOW_BEFORE_UNLOAD),
    });

    /*
     * Channel should be close if current window is reloading or close(WINDOW_BEFORE_UNLOAD)
     * Or if target window closed
      * */
    if (unload || (res && res.event === 'closed')) {
      channel.close();
    } else {
      yield put(windowsManagerActions.addWindowEvent({
        id: windowId,
        log: {
          type: res.type,
          dateString: (
            new Date().toLocaleDateString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          ),
          name: res.event,
        },
        scope,
      }));
    }
  }
}

export function createWindowChannel({
  events = [],
  webContentsEvents = [],
  win,
} = {
  events: [],
  webContentsEvents: [],
}) {
  const bindEmitters = {};
  return eventChannel((emitter) => {
    events.forEach((event) => {
      bindEmitters[event] = (data) => {
        emitter({
          type: 'window',
          event,
          data,
        });
      };
      win.on(
        event,
        bindEmitters[event],
      );
    });
    webContentsEvents.forEach((event) => {
      bindEmitters[event] = (data) => {
        emitter({
          type: 'webContents',
          event,
          data,
        });
      };
      win.webContents.on(
        event,
        bindEmitters[event],
      );
    });
    return () => {
      if (!win.isDestroyed()) {
        webContentsEvents.forEach((event) => {
          win.webContents.removeListener(
            event,
            bindEmitters[event],
          );
        });
      }
      events.forEach((event) => {
        win.removeListener(
          event,
          bindEmitters[event],
        );
      });
      console.log('Close window channel');
    };
  });
}

function* onReadyToShow({
  channel,
  win,
}) {
  yield take(channel);
  win.show();
  channel.close();
}

function* onDomReady({
  channel,
  win,
}) {
  while (true) {
    yield take(channel);
    const {
      allIds,
      byId,
      scopes,
    } = yield select(state => state.windowsManager);
    yield put(windowsManagerActions.setWindowsState({
      allIds,
      byId,
      scopes,
      merge: false,
      scope: win.id,
    }));
  }
}

export function* onClosed({
  channel,
  win,
}) {
  /* You can't work wtih instance after it was destroyed */
  const windowId = win.id;
  yield take(channel);
  channel.close();
  yield put(windowsManagerActions.removeWindow({
    id: windowId,
    scope: 'all',
  }));
  console.log(`window ${windowId} is closed`);
}

export function* forkNewWindow({
  url,
  scopes = [],
  showOnReady = false,
  BrowserWindow,
  options,
}) {
  const win = new BrowserWindow(options);

  yield put(windowsManagerActions.addWindow({
    id: win.id,
    scopes,
    scope: 'all',
  }));

  const closedWindowChannel = createWindowChannel({
    win,
    events: [
      'closed',
    ],
  });

  yield spawn(onClosed, {
    channel: closedWindowChannel,
    win,
  });

  const domReadyChannel = createWindowChannel({
    win,
    webContentsEvents: [
      'dom-ready',
    ],
  });

  yield spawn(onDomReady, {
    channel: domReadyChannel,
    win,
  });

  if (showOnReady) {
    const readyToShowChannel = createWindowChannel({
      win,
      events: [
        'ready-to-show',
      ],
    });
    yield spawn(onReadyToShow, {
      channel: readyToShowChannel,
      win,
    });
  }

  if (url) {
    win.loadURL(url);
  }

  return win;
}
