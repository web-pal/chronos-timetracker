// @flow
import {
  take,
  takeEvery,
  put,
  call,
  fork,
} from 'redux-saga/effects';
import Raven from 'raven-js';
import moment from 'moment';

import {
  uiActions,
  resourcesActions,
  sprintsActions,
  types,
} from 'actions';

import type {
  LogLevel,
  LogLevels,
  FlagType,
  FlagAction,
} from '../types';

import {
  setToStorage,
} from './storage';
import config from '../config';


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

export function* infoLog(...argw: any): Generator<*, void, *> {
  if (config.infoLog) {
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
}

export function* throwError(err: mixed): Generator<*, void, *> {
  yield call(console.error, err);
  Raven.captureException(err);
  // TODO
  // yield call(notify, 'unexpected error in runtime', 'Error in runtime', 'normal', 'errorIcon');
}

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

export function* watchSidebarTypeChange(): Generator<*, *, *> {
  while (true) {
    yield take(types.SET_SIDEBAR_TYPE);
    yield put(uiActions.setSidebarFiltersOpen(false));
  }
}

function* onUiChange({
  payload: {
    key,
    value,
  },
}): Generator<*, *, *> {
  try {
    if (key === 'issuesSourceType') {
      yield call(setToStorage, key, value);
      if (value === 'scrum') {
        yield put(sprintsActions.fetchSprintsRequest());
      }
    }
    if (['issuesSourceId', 'issuesSprintId'].includes(key)) {
      yield call(setToStorage, key, value);
      if (value) {
        yield put(resourcesActions.clearResourceList({
          resourceName: 'issues',
          list: 'filterIssues',
        }));
        yield put(resourcesActions.setResourceMeta({
          resourceName: 'issues',
          meta: {
            filterIssuesTotalCount: 10,
          },
        }));
        yield put(resourcesActions.setResourceMeta({
          resourceName: 'issues',
          meta: {
            refetchFilterIssuesMarker: true,
          },
        }));
      }
    }
  } catch (err) {
    yield call(throwError, err);
  }
}

export function* watchUiStateChange(): Generator<*, *, *> {
  yield takeEvery(types.SET_UI_STATE, onUiChange);
}
