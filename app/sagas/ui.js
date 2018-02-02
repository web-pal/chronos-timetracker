// @flow
import {
  delay,
} from 'redux-saga';
import {
  takeEvery,
  put,
  call,
  fork,
  select,
} from 'redux-saga/effects';
import Raven from 'raven-js';
import moment from 'moment';

import {
  uiActions,
  issuesActions,
  sprintsActions,
  types,
} from 'actions';
import {
  getResourceIds,
  getIssueWorklogs,
} from 'selectors';

import type {
  LogLevel,
  LogLevels,
  FlagType,
  FlagAction,
} from '../types';

import {
  setToStorage,
} from './storage';
import {
  issueSelectFlow,
} from './issues';
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


/* eslint-disable */
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
/* eslint-enable */

function* autoDeleteFlag(id) {
  yield call(delay, 5 * 1000);
  yield put(uiActions.deleteFlag(id));
}

export function* notify(
  message: string = '',
  title: string = '',
  actions: Array<FlagAction> = [],
  level: string = 'normal',
  icon: string = 'bellIcon',
): Generator<*, void, *> {
  const newFlag: FlagType = {
    id: uuidv4(),
    title,
    actions,
    appearance: level,
    description: message,
    icon,
  };
  yield put(uiActions.addFlag(newFlag));
  yield fork(autoDeleteFlag, newFlag.id);
}

function* onSidebarChange(sidebarType) {
  if (sidebarType === 'recent') {
    const recentIssues = yield select(getResourceIds('issues', 'recentIssues'));
    if (!recentIssues.length) {
      yield put(issuesActions.fetchRecentIssuesRequest());
    }
  }
  yield put(uiActions.setUiState('sidebarFiltersIsOpen', false));
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
    }
    if (key === 'selectedIssueId') {
      yield fork(issueSelectFlow, value);
    }
    if (key === 'sidebarType') {
      yield fork(onSidebarChange, value);
    }
  } catch (err) {
    yield call(throwError, err);
  }
}

export function* scrollToIndexRequest({
  worklogId,
  issueId,
}): Generator<*, *, *> {
  try {
    const worklogs = yield select(getIssueWorklogs(issueId));
    yield put(uiActions.setUiState(
      'issueViewWorklogsScrollToIndex',
      worklogs.findIndex(w => worklogId === w.id),
    ));
  } catch (err) {
    yield call(throwError, err);
  }
}

export function* watchUiStateChange(): Generator<*, *, *> {
  yield takeEvery(types.SET_UI_STATE, onUiChange);
}

export function* watchScrollToIndexRequest(): Generator<*, *, *> {
  yield takeEvery(
    types.ISSUE_WORKLOGS_SCROLL_TO_INDEX_REQUEST,
    scrollToIndexRequest,
  );
}
