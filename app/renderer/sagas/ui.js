// @flow
import {
  delay,
} from 'redux-saga';
import {
  takeLatest,
  takeEvery,
  put,
  call,
  fork,
  select,
} from 'redux-saga/effects';
import Raven from 'raven-js';
import moment from 'moment';

import config from 'config';
import {
  trackMixpanel,
} from 'utils/stat';

import type {
  Id,
} from 'types';

import {
  uiActions,
  issuesActions,
  sprintsActions,
  actionTypes,
} from 'actions';
import {
  getResourceIds,
  getIssueWorklogs,
  getUiState,
} from 'selectors';

import {
  setToStorage,
  getFromStorage,
} from './storage';
import {
  issueSelectFlow,
} from './issues';


const LOG_LEVELS = {
  info: 'info',
  log: 'log',
  error: 'error',
  warn: 'warn',
};

const mutedText: string = 'color: #888; font-weight: 100;';

const LOG_STYLE = {
  info: 'color: white; background: blue;',
  log: 'color: white; background: magenta;',
  error: 'color: white; background: red;',
  warn: 'color: white; background: orange;',
};

export function* infoLog(...argw: any): Generator<*, void, *> {
  if (config.infoLog) {
    const level = LOG_LEVELS.info;
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

export function* throwError(err: any): Generator<*, void, *> {
  yield call(console.error, err);
  Raven.captureException(err);
}


/* eslint-disable */
function uuidv4() {
  // $FlowFixMe
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    // $FlowFixMe
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
/* eslint-enable */

function* autoDeleteFlag(id) {
  yield call(delay, 5 * 1000);
  yield put(uiActions.deleteFlag(id));
}

export function* notify({
  description = '',
  title = '',
  actions = [],
  appearance = 'normal',
  icon = 'bellIcon',
  resourceType,
  request,
  spinnerTitle = '',
  type,
  autoDelete = true,
}: {
  description?: string,
  title?: string,
  actions?: Array<any>,
  appearance?: string,
  icon?: string,
  resourceType? : string,
  request?: string,
  spinnerTitle?: string,
  type?: string,
  autoDelete?: boolean,
}): Generator<*, void, *> {
  const newFlag = {
    id: uuidv4(),
    title,
    actions,
    appearance,
    description,
    icon,
    resourceType,
    request,
    spinnerTitle,
    type,
  };
  yield put(uiActions.addFlag(newFlag));
  if (autoDelete) {
    yield fork(autoDeleteFlag, newFlag.id);
  }
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
      yield put(uiActions.setUiState('issuesSearch', ''));
      if (value === 'scrum') {
        yield put(sprintsActions.fetchSprintsRequest());
      }
    }
    if (['issuesSourceId', 'issuesSprintId'].includes(key)) {
      yield put(uiActions.setUiState('issuesSearch', ''));
      yield call(setToStorage, key, value);
    }
    if (key === 'selectedIssueId') {
      yield fork(issueSelectFlow, value);
    }
    if (key === 'sidebarType') {
      yield fork(onSidebarChange, value);
      trackMixpanel(`Issue was changed on ${value}`);
    }
  } catch (err) {
    yield call(throwError, err);
  }
}

function* onIssuesFilterChange(): Generator<*, *, *> {
  const filters = yield select(getUiState('issuesFilters'));
  yield call(
    setToStorage,
    'issuesFilters',
    filters,
  );
}

export function* scrollToIndexRequest({
  worklogId,
  issueId,
}: {
  worklogId: Id,
  issueId: Id,
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
  yield takeEvery(actionTypes.SET_UI_STATE, onUiChange);
}

export function* watchScrollToIndexRequest(): Generator<*, *, *> {
  yield takeEvery(
    actionTypes.ISSUE_WORKLOGS_SCROLL_TO_INDEX_REQUEST,
    scrollToIndexRequest,
  );
}

export function* watchSetIssuesFilter(): Generator<*, *, *> {
  yield takeLatest(
    actionTypes.SET_ISSUES_FILTER,
    onIssuesFilterChange,
  );
}

export function* newFeaturesFlow(): Generator<*, *, *> {
  function* flow({ payload: { featureId } }): Generator<*, void, *> {
    let acknowlegdedFeatures = yield call(getFromStorage, 'acknowlegdedFeatures');
    if (!acknowlegdedFeatures) acknowlegdedFeatures = [];
    acknowlegdedFeatures.push(featureId);
    yield call(setToStorage, 'acknowlegdedFeatures', acknowlegdedFeatures);
    yield call(delay, 10000);
    yield put(uiActions.setUiState('acknowlegdedFeatures', acknowlegdedFeatures));
  }
  yield takeLatest(actionTypes.ACKNOWLEDGE_FEATURE, flow);
}
