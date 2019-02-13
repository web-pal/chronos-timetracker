// @flow
import {
  call,
  take,
  takeEvery,
  fork,
  select,
  put,
  race,
  cancel,
  cancelled,
} from 'redux-saga/effects';
import {
  eventChannel,
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
  });
}

function* checkIdle() {
  const idleTime = system.getIdleTime();
  const idleState = yield select(getTimerState('idleState'));
  if (
    idleState
    && idleTime < config.idleTimeThreshold
  ) {
    yield put(timerActions.setIdleState(false));
  }
  if (
    !idleState
    && idleTime >= config.idleTimeThreshold
  ) {
    yield put(timerActions.setIdleState(true));
    return true;
  }
  return false;
}

function* idleWindow() {
  let win = null;
  try {
    win = yield call(
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
          width: 480,
          height: 150,
          frame: false,
          resizable: false,
          alwaysOnTop: true,
          title: 'Idle popup',
          webPreferences: {
            nodeIntegration: true,
            devTools: (
              config.popupWindowDevTools
              || process.env.DEBUG_PROD === 'true'
            ),
          },
        },
      },
    );
    while (true) {
      yield race({
        keep: take(actionTypes.KEEP_IDLE_TIME),
        dismiss: take(actionTypes.DISMISS_IDLE_TIME),
      });
      yield cancel();
    }
  } finally {
    if (
      yield cancelled()
      && win
    ) {
      win.destroy();
    }
  }
}

function* handleTick(timerChannel) {
  let idleWindowTask = null;
  while (true) {
    yield take(timerChannel);

    yield put(timerActions.tick());
    const showIdleWindow = yield call(checkIdle);
    if (
      showIdleWindow
      && (
        !idleWindowTask
        || idleWindowTask.isCancelled()
      )
    ) {
      idleWindowTask = yield fork(idleWindow);
    }
  }
}

function* timerFlow() {
  const selectedIssueId = yield select(getUiState('selectedIssueId'));
  yield put(uiActions.setUiState('trackingIssueId', selectedIssueId));

  const timerChannel = yield call(createTimerChannel);
  const tickTask = yield fork(handleTick, timerChannel);

  while (true) {
    yield take(actionTypes.STOP_TIMER_REQUEST);

    const time = yield select(getTimerState('time'));
    if (time < 60) {
      yield put(uiActions.setModalState('alert', true));
      const { type } = yield take([
        actionTypes.CONTINUE_TIMER,
        actionTypes.STOP_TIMER,
      ]);
      if (type === actionTypes.STOP_TIMER) {
        yield cancel(tickTask);
        yield put(timerActions.resetTimer());
      }
    } else {
      const { allowEmptyComment } = yield select(getSettingsState('localDesktopSettings'));
      const comment = yield select(getUiState('worklogComment'));
      if (!allowEmptyComment && !comment) {
        yield fork(notify, {
          title: 'Please set comment for worklog',
        });
        yield put(uiActions.setUiState('isCommentDialogOpen', true));
      } else {
        const issue = yield select(getTrackingIssue);
        const timeSpentInSeconds = yield select(getTimerState('time'));
        yield cancel(tickTask);
        yield put(timerActions.resetTimer());
        yield call(
          uploadWorklog,
          {
            issueId: issue.id,
            comment,
            timeSpentInSeconds,
          },
        );
        yield cancel();
      }
    }
  }
}

export function* takeStartTimer(): Generator<*, *, *> {
  yield takeEvery(actionTypes.START_TIMER, timerFlow);
}
