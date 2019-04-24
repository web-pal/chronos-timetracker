// @flow
import * as eff from 'redux-saga/effects';
import * as Sentry from '@sentry/electron';
import {
  eventChannel,
  buffers,
} from 'redux-saga';
import {
  remote,
} from 'electron';
import rimraf from 'rimraf';
import NanoTimer from 'nanotimer';

import {
  windowsManagerSagas,
} from 'shared/sagas';
import {
  actionTypes,
  uiActions,
  timerActions,
  screenshotsActions,
} from 'actions';
import {
  trayActions,
  actionTypes as sharedActionTypes,
} from 'shared/actions';
import {
  getTimerState,
  getUiState,
  getTrackingIssue,
} from 'selectors';
import config from 'config';
import {
  randomIntFromInterval,
} from 'utils/random';

import {
  calculateInactivityPeriod,
} from './helpers';
import {
  notify,
} from './ui';
import {
  uploadWorklog,
} from './worklogs';


const system = remote.require('desktop-idle');
const { app } = remote.require('electron');

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
    return [true, idleTime];
  }
  return [false, idleTime];
}

function* setScreenshotTimeForCurrentPeriod({
  time,
  timestamp,
  screenshots,
}) {
  const screenshotsPeriod = yield eff.select(getUiState('screenshotsPeriod'));
  const screenshotsPeriodInSeconds = (
    screenshotsPeriod < 30
      ? 30
      : screenshotsPeriod
  );
  const currentPeriodNumber = Math.floor(time / screenshotsPeriodInSeconds);
  const currentPeriodScreenshotExist = (
    screenshots.find(
      s => (
        s.time >= currentPeriodNumber * screenshotsPeriodInSeconds
      ),
    )
  );
  if (!currentPeriodScreenshotExist) {
    const screenshotTime = yield eff.select(getUiState('screenshotTime'));
    // Screenshot time already expired
    if (screenshotTime < time) {
      // Next period less then 5 seconds, do the screenshot now!
      if ((time - screenshotTime) < 5) {
        // Mark screenshot as idle if the time less then 2 seconds
        if ((time - screenshotTime) < 2) {
          const screenshotViewerWindowId = yield eff.select(getUiState('screenshotViewerWindowId'));
          yield eff.put(screenshotsActions.addScreenshot({
            time,
            timestamp,
            status: 'idle',
          }, screenshotViewerWindowId));
          yield eff.put(uiActions.setUiState({
            screenshotTime: (
              randomIntFromInterval(
                (currentPeriodNumber * screenshotsPeriodInSeconds) + 5,
                ((currentPeriodNumber + 1) * screenshotsPeriodInSeconds) - 2,
              )
            ),
            screenshotTimeId: new Date().getTime(),
          }));
        } else {
          yield eff.put(screenshotsActions.takeScreenshotRequest({
            isTest: false,
            time,
            timestamp,
          }));
        }
      } else {
        yield eff.put(uiActions.setUiState({
          screenshotTime: (
            randomIntFromInterval(
              time,
              (currentPeriodNumber + 1) * screenshotsPeriodInSeconds,
            )
          ),
          screenshotTimeId: new Date().getTime(),
        }));
      }
    }
  }
}

function* handleIdleScreenshots({
  dismiss,
  keep,
  time,
  timestamp,
}) {
  const {
    takeScreenshotLoading,
    uploadScreenshotLoading,
  } = yield eff.select(getUiState([
    'takeScreenshotLoading',
    'uploadScreenshotLoading',
  ]));
  if (
    takeScreenshotLoading
    || uploadScreenshotLoading
  ) {
    yield eff.race([
      eff.take(actionTypes.TAKE_SCREENSHOT_FINISHED),
      eff.take(actionTypes.UPLOAD_SCREENSHOT_FINISHED),
    ]);
  }
  const screenshots = yield eff.select(getUiState('screenshots'));
  const screenshotsPeriod = yield eff.select(getUiState('screenshotsPeriod'));

  if (dismiss) {
    /* Remove screenshots which for some reason lands on idle time(it should never happen) */
    /* this operation just in case */
    const screenshotViewerWindowId = yield eff.select(getUiState('screenshotViewerWindowId'));
    yield eff.put(screenshotsActions.setScreenshots(
      screenshots.filter(
        s => (
          s.time < time
        ),
      ),
      screenshotViewerWindowId,
    ));
    yield eff.call(
      setScreenshotTimeForCurrentPeriod,
      {
        time,
        timestamp,
        screenshots,
      },
    );
    const {
      fullyExpiredPeriods,
      startPeriodNumber,
      screenshotsPeriodInSeconds,
    } = calculateInactivityPeriod({
      screenshotsPeriod,
      idleTimeInSceonds: dismiss.payload,
      time: time + dismiss.payload,
    });
    const currentPeriodNumber = Math.floor(time / screenshotsPeriodInSeconds);
    const lastPeriodNumber = Math.floor((time + dismiss.payload) / screenshotsPeriodInSeconds);
    const activity = yield eff.select(getUiState('activity'));
    const expiredActivity = Array.from(Array(fullyExpiredPeriods).keys()).reduce(
      (acc, periodNumber) => ({
        ...acc,
        [periodNumber + startPeriodNumber]: 0,
      }),
      {
        [currentPeriodNumber]: (
          activity[currentPeriodNumber]
          - (((currentPeriodNumber + 1) * screenshotsPeriodInSeconds) - time)
        ),
        [lastPeriodNumber]: 0,
      },
    );
    yield eff.put(uiActions.setUiState('activity', expiredActivity));
  }

  if (keep) {
    const {
      fullyExpiredPeriods,
      startPeriodInSeconds,
      screenshotsPeriodInSeconds,
    } = calculateInactivityPeriod({
      idleTimeInSceonds: keep.payload,
      screenshotsPeriod,
      time,
    });
    const screenshotTime = yield eff.select(getUiState('screenshotTime'));
    const firstIdlePeriodScreenshotExist = (
      screenshots.find(
        s => (
          s.time === screenshotTime
        ),
      )
    );
    const screenshotViewerWindowId = yield eff.select(getUiState('screenshotViewerWindowId'));
    if (
      time > screenshotTime
      && !firstIdlePeriodScreenshotExist
    ) {
      yield eff.put(screenshotsActions.setScreenshots(
        [
          ...screenshots,
          {
            time: screenshotTime,
            timestamp: timestamp - ((time - screenshotTime) * 1000),
            status: 'idle',
          },
        ],
        screenshotViewerWindowId,
      ));
    }
    const expiredScreenshots = Array.from(Array(fullyExpiredPeriods).keys()).map(
      (periodNumber) => {
        const t = (startPeriodInSeconds + ((periodNumber + 1) * screenshotsPeriodInSeconds)) - 2;
        return ({
          time: t,
          timestamp: timestamp - ((time - t) * 1000),
          status: 'idle',
        });
      },
    );
    yield eff.put(screenshotsActions.setScreenshots(
      [
        ...screenshots,
        ...expiredScreenshots,
      ],
      screenshotViewerWindowId,
    ));

    yield eff.call(
      setScreenshotTimeForCurrentPeriod,
      {
        time,
        timestamp,
        screenshots,
      },
    );
  }
}

function* idleWindow(screenshotsEnabled) {
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
        showOnReady: true,
        BrowserWindow: remote.BrowserWindow,
        options: {
          show: false,
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
      const {
        keep,
        dismiss,
      } = yield eff.race({
        keep: eff.take(actionTypes.KEEP_IDLE_TIME),
        dismiss: eff.take(actionTypes.DISMISS_IDLE_TIME),
        currentWindowClose: eff.take(sharedActionTypes.WINDOW_BEFORE_UNLOAD),
      });
      if (screenshotsEnabled) {
        const time = yield eff.select(getTimerState('time'));
        const timestamp = new Date().getTime();
        yield eff.spawn(
          handleIdleScreenshots,
          {
            dismiss,
            keep,
            time,
            timestamp,
          },
        );
      }
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
  const trayShowTimer = yield eff.select(getUiState('trayShowTimer'));
  if (trayShowTimer) {
    const humanFormat = new Date(time * 1000).toISOString().substr(11, 5);
    remote.getGlobal('tray').setTitle(humanFormat);
  }
}

function* handleTick({
  timerChannel,
  screenshotsEnabled,
}) {
  let idleWindowTask = null;
  let prevScreenshotId = null;
  const screenshotsPeriod = yield eff.select(getUiState('screenshotsPeriod'));
  while (true) {
    yield eff.take(timerChannel);
    const bufferSeconds = yield eff.flush(timerChannel);

    yield eff.put(timerActions.tick(
      1 + bufferSeconds.length,
    ));
    const time = yield eff.select(getTimerState('time'));

    if (bufferSeconds.length) {
      console.log('!!!!!!!!!!!!!!!!!');
      Sentry.captureMessage(`bufferSeconds is ${bufferSeconds.length}`);
    }
    yield eff.call(setTimeToTray);
    const [
      showIdleWindow,
      idleTime,
    ] = yield eff.call(checkIdle);
    if (
      screenshotsEnabled
      && (
        idleTime > 1
        || (
          idleWindowTask
          && !idleWindowTask?.isCancelled()
        )
      )
    ) {
      const screenshotsPeriodInSeconds = (
        screenshotsPeriod < 30
          ? 30
          : screenshotsPeriod
      );
      const currentPeriodNumber = Math.floor(time / screenshotsPeriodInSeconds);
      const activity = yield eff.select(getUiState('activity'));
      yield eff.put(uiActions.setUiState('activity', {
        [currentPeriodNumber]: (activity[currentPeriodNumber] || 0) + 1,
      }));
    }
    if (
      showIdleWindow
      && (
        !idleWindowTask
        || idleWindowTask.isCancelled()
      )
    ) {
      idleWindowTask = yield eff.fork(
        idleWindow,
        screenshotsEnabled,
      );
    }
    if (
      screenshotsEnabled
      && (
        !idleWindowTask
        || idleWindowTask.isCancelled()
      )
    ) {
      const screenshotTime = yield eff.select(getUiState('screenshotTime'));
      const screenshotTimeId = yield eff.select(getUiState('screenshotTimeId'));
      /* In casee of render freeze, if it will happen often, shift it to the main process */
      if (time >= screenshotTime) {
        if (prevScreenshotId !== screenshotTimeId) {
          prevScreenshotId = screenshotTimeId;
          yield eff.put(screenshotsActions.takeScreenshotRequest({
            isTest: false,
            time,
            timestamp: new Date().getTime(),
          }));
          if (time !== screenshotTime) {
            console.log('TIME !== SCREENSHOTTIME');
            console.log(`time: ${time}, screenshotTime: ${screenshotTime}`);
            Sentry.captureMessage(
              `time !== screenshotTime, time: ${time}, screenshotTime: ${screenshotTime}`,
            );
          }
        }
      }
    }
  }
}

function* timerFlow() {
  const selectedIssueId = yield eff.select(getUiState('selectedIssueId'));
  yield eff.put(uiActions.setUiState({
    trackingIssueId: selectedIssueId,
  }));
  yield eff.put(trayActions.trayStartTimer());

  const screenshotsEnabled = yield eff.select(getUiState('screenshotsEnabled'));
  const screenshotsPeriod = yield eff.select(getUiState('screenshotsPeriod'));
  if (screenshotsEnabled) {
    // 5 - screenshotsPeriod - 2
    const firstScreenshotTime = randomIntFromInterval(5, screenshotsPeriod - 2);
    yield eff.put(uiActions.setUiState({
      screenshotTime: firstScreenshotTime,
      screenshotTimeId: new Date().getTime(),
    }));
  }

  const timerChannel = yield eff.call(createTimerChannel);
  const tickTask = yield eff.fork(
    handleTick,
    {
      timerChannel,
      screenshotsEnabled,
    },
  );

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
        const {
          takeScreenshotLoading,
          uploadScreenshotLoading,
        } = yield eff.select(getUiState([
          'takeScreenshotLoading',
          'uploadScreenshotLoading',
        ]));
        if (
          takeScreenshotLoading
          || uploadScreenshotLoading
        ) {
          yield eff.race([
            eff.take(actionTypes.TAKE_SCREENSHOT_FINISHED),
            eff.take(actionTypes.UPLOAD_SCREENSHOT_FINISHED),
          ]);
        }
        yield eff.put(uiActions.setUiState({
          screenshots: [],
          activity: {},
        }));
        const screenshotViewerWindowId = yield eff.select(
          getUiState('screenshotViewerWindowId'),
        );
        const screenshotsWin = (
          screenshotViewerWindowId
          && remote.BrowserWindow.fromId(screenshotViewerWindowId)
        );
        if (
          screenshotsWin
          && !screenshotsWin.isDestroyed()
        ) {
          screenshotsWin.destroy();
        }
        yield eff.cps(
          rimraf,
          `${app.getPath('userData')}/screens/`,
        );
        if (
          closeRequest
          && continueStop
        ) {
          if (process.env.NODE_ENV === 'development') {
            window.location.reload();
          } else {
            app.quit();
          }
        }
      } else {
        const allowEmptyComment = yield eff.select(getUiState('allowEmptyComment'));
        const comment = yield eff.select(getUiState('worklogComment'));
        if (
          !allowEmptyComment
          && !comment
        ) {
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
          yield eff.put(uiActions.setUiState({
            screenshots: [],
            activity: {},
          }));
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
