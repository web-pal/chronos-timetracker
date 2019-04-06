// @flow
import * as eff from 'redux-saga/effects';
import {
  eventChannel,
  buffers,
} from 'redux-saga';
import {
  remote,
} from 'electron';
import NanoTimer from 'nanotimer';

import config from 'config';

import {
  windowsManagerSagas,
} from 'shared/sagas';
import {
  actionTypes,
  uiActions,
  timerActions,
} from 'actions';
import {
  trayActions,
} from 'shared/actions';
import {
  getTimerState,
  getSettingsState,
  getUiState,
  getTrackingIssue,
} from 'selectors';

import {
  notify,
} from './ui';
import {
  uploadWorklog,
} from './worklogs';


const system = remote.require('desktop-idle');

function createTimerChannel() {
  const ticker = new NanoTimer();
  let secs = 0;
  return eventChannel((emitter) => {
    ticker.setInterval(() => {
      secs += 1;
      emitter(secs);
    }, '', '1s');
    return () => {
      ticker.clearInterval();
    };
  }, buffers.expanding());
}

function* checkIdle() {
  const idleTime = system.getIdleTime();
  const idleState = yield eff.select(getTimerState('idleState'));
  if (
    idleState
    && idleTime < config.idleTimeThreshold
  ) {
    yield eff.put(timerActions.setIdleState(false));
  }
  if (
    !idleState
    && idleTime >= config.idleTimeThreshold
  ) {
    yield eff.put(timerActions.setIdleState(true));
    return true;
  }
  return false;
}

function* idleWindow() {
  let win = null;
  try {
    win = yield eff.call(
      windowsManagerSagas.forkNewWindow,
      {
        url: (
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/idlePopup.html'
            : `file://${__dirname}/idlePopup.html`
        ),
        showOnReady: false,
        BrowserWindow: remote.BrowserWindow,
        options: {
          width: 510,
          height: 160,
          frame: false,
          resizable: false,
          alwaysOnTop: true,
          title: 'Idle popup',
          webPreferences: {
            nodeIntegration: true,
            devTools: (
              config.idleWindowDevTools
              || process.env.DEBUG_PROD === 'true'
            ),
          },
        },
      },
    );
    while (true) {
      yield eff.race({
        keep: eff.take(actionTypes.KEEP_IDLE_TIME),
        dismiss: eff.take(actionTypes.DISMISS_IDLE_TIME),
      });
      yield eff.cancel();
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

function* setTimeToTray() {
  const time = yield eff.select(getTimerState('time'));
  const localDesktopSettings = yield eff.select(getSettingsState('localDesktopSettings'));
  const { trayShowTimer } = localDesktopSettings;
  if (trayShowTimer) {
    const humanFormat = new Date(time * 1000).toISOString().substr(11, 5);
    remote.getGlobal('tray').setTitle(humanFormat);
  }
}

function* handleTick(timerChannel) {
  let idleWindowTask = null;
  while (true) {
    yield eff.take(timerChannel);
    const bufferSeconds = yield eff.flush(timerChannel);

    yield eff.put(timerActions.tick(
      1 + bufferSeconds.length,
    ));
    yield eff.call(setTimeToTray);
    const showIdleWindow = yield eff.call(checkIdle);
    if (
      showIdleWindow
      && (
        !idleWindowTask
        || idleWindowTask.isCancelled()
      )
    ) {
      idleWindowTask = yield eff.fork(idleWindow);
    }
  }
}

function* timerFlow() {
  const selectedIssueId = yield eff.select(getUiState('selectedIssueId'));
  yield eff.put(uiActions.setUiState({
    trackingIssueId: selectedIssueId,
  }));
  yield eff.put(trayActions.trayStartTimer());
  const timerChannel = yield eff.call(createTimerChannel);
  const tickTask = yield eff.fork(handleTick, timerChannel);

  while (true) {
    const { closeRequest } = yield eff.take(actionTypes.STOP_TIMER_REQUEST);
    let continueStop = true;
    if (closeRequest) {
      continueStop = window.confirm('Tracking in progress, save worklog before quit?');
    }

    if (continueStop) {
      const time = yield eff.select(getTimerState('time'));
      if (time < 60) {
        yield eff.put(uiActions.setModalState('alert', true));
        const { type } = yield eff.take([
          actionTypes.CONTINUE_TIMER,
          actionTypes.STOP_TIMER,
        ]);
        if (type === actionTypes.STOP_TIMER) {
          yield eff.cancel(tickTask);
          yield eff.put(timerActions.resetTimer());
          yield eff.put(trayActions.trayStopTimer());
        }
        if (
          closeRequest
          && continueStop
        ) {
          if (process.env.NODE_ENV === 'development') {
            window.location.reload();
          } else {
            remote.app.quit();
          }
        }
      } else {
        const { allowEmptyComment } = yield eff.select(getSettingsState('localDesktopSettings'));
        const comment = yield eff.select(getUiState('worklogComment'));
        if (!allowEmptyComment && !comment) {
          yield eff.fork(notify, {
            title: 'Please set comment for worklog',
          });
          yield eff.put(uiActions.setUiState({
            isCommentDialogOpen: true,
          }));
        } else {
          const issue = yield eff.select(getTrackingIssue);
          const timeSpentInSeconds = yield eff.select(getTimerState('time'));
          yield eff.cancel(tickTask);
          yield eff.put(timerActions.resetTimer());
          yield eff.call(
            uploadWorklog,
            {
              issueId: issue.id,
              comment,
              timeSpentInSeconds,
            },
          );
          yield eff.put(trayActions.trayStopTimer());
          if (
            closeRequest
            && continueStop
          ) {
            if (process.env.NODE_ENV === 'development') {
              window.location.reload();
            } else {
              remote.app.quit();
            }
          }
          yield eff.cancel();
        }
      }
    }
  }
}

export function* takeStartTimer(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.START_TIMER, timerFlow);
}
