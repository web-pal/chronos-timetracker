// @flow
/* eslint-disable no-console */
import { take, put, call, fork, select } from 'redux-saga/effects';
import moment from 'moment';
import { uiActions, timerActions, issuesActions, types } from 'actions';
import { getSelectedIssue } from 'selectors';
import type { LogLevel, LogLevels, FlagType, FlagAction } from '../types';

import createIpcChannel from './ipc';

const LOG_LEVELS: LogLevels = {
  info: 'info',
  log: 'log',
  error: 'error',
  warn: 'warn',
};

const mutedText: string = 'color: #888; font-weight: 100;';

const LOG_STYLE: { [LogLevel]: string } = {
  info: 'color: white; background: blue;',
  log: 'color: white; background: magenta;',
  error: 'color: white; background: red;',
  warn: 'color: white; background: orange;',
};

export function* notify(
  message: string = '',
  title: string = '',
  actions: Array<FlagAction> = [],
  level: string = 'normal',
  icon: string = 'bellIcon',
): Generator<*, void, *> {
  const newFlag: FlagType = {
    title,
    actions,
    appearance: level,
    description: message,
    icon,
  };
  yield put(uiActions.addFlag(newFlag));
}

export function* infoLog(...argw: any): Generator<*, void, *> {
  const level: LogLevel = LOG_LEVELS.info;
  yield call(
    console.groupCollapsed,
    `%c log %c ${level} %c ${argw[0]} %c @ ${moment().format('hh:mm:ss')}`,
    mutedText,
    LOG_STYLE[level],
    'color: black;',
    mutedText,
  );
  yield call(console[level], ...argw);
  yield call(console.groupEnd);
}

export function* throwError(err: mixed): Generator<*, void, *> {
  yield call(console.error, err);
  // TODO
  // yield call(notify, 'unexpected error in runtime', 'Error in runtime', 'normal', 'errorIcon');
}

export function* watchSidebarTypeChange(): Generator<*, *, *> {
  while (true) {
    yield take(types.SET_SIDEBAR_TYPE);
    yield put(uiActions.setSidebarFiltersOpen(false));
  }
}

let trayStartListener;
let trayStopListener;
let traySettingsListener;

function* watchTrayStart(): Generator<*, *, *> {
  while (true) {
    yield take(trayStartListener);
    const selectedIssue = yield select(getSelectedIssue);
    yield put(issuesActions.setTrackingIssue(selectedIssue));
    yield put(timerActions.startTimer());
  }
}

function* watchTrayStop(): Generator<*, *, *> {
  while (true) {
    yield take(trayStopListener);
    yield put(timerActions.stopTimerRequest());
  }
}

function* watchTraySettings(): Generator<*, *, *> {
  while (true) {
    yield take(traySettingsListener);
    yield put(uiActions.setSettingsModalOpen(true));
  }
}

export function* initializeTrayMenuListeners(): Generator<*, *, *> {
  trayStartListener = yield call(createIpcChannel, 'tray-start-click');
  yield fork(watchTrayStart);
  trayStopListener = yield call(createIpcChannel, 'tray-stop-click');
  yield fork(watchTrayStop);
  traySettingsListener = yield call(createIpcChannel, 'tray-settings-click');
  yield fork(watchTraySettings);
}
