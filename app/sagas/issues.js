// @flow
import { delay } from 'redux-saga';
import { call, select, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import * as Api from 'api';
import Raven from 'raven-js';
import {
  getSelectedProject,
  getSelectedSprintId,
  getUserData,
  getRecentIssueIds,
  getIssuesSearchValue,
  getFoundIssueIds,
  getIssueFilters,
} from 'selectors';
import { issuesActions, types } from 'actions';
import normalizePayload from 'normalize-util';

import { throwError } from './ui';

import type { FetchIssuesRequestAction, Project, Id, User, IssueFilters } from '../types';

export function* fetchIssues({
  payload: { startIndex, stopIndex, search },
}: FetchIssuesRequestAction): Generator<*, *, *> {
  try {
    yield put(issuesActions.setIssuesFetching(true));
    if (search) {
      yield put(issuesActions.setIssuesTotalCount(0));
      yield put(issuesActions.clearFoundIssueIds());
    }
    const selectedProject: Project = yield select(getSelectedProject);
    const selectedSprintId: Id = yield select(getSelectedSprintId);
    const searchValue: string = yield select(getIssuesSearchValue);
    const filters: IssueFilters = yield select(getIssueFilters);
    const opts = {
      startIndex,
      stopIndex,
      projectId: selectedProject.id,
      projectType: selectedProject.type || 'project',
      sprintId: selectedSprintId,
      searchValue,
      filters,
    };
    const response = yield call(Api.fetchIssues, opts);
    const normalizedIssues = yield call(normalizePayload, response.issues, 'issues');
    yield put(issuesActions.setIssuesTotalCount(response.total));
    yield put(issuesActions.addIssues(normalizedIssues));
    if (search) {
      yield put(issuesActions.fillFoundIssueIds(normalizedIssues.ids));
    } else {
      const foundIssueIds = yield select(getFoundIssueIds);
      if (foundIssueIds.length !== 0) {
        yield put(issuesActions.addFoundIssueIds(normalizedIssues.ids));
      }
    }
    yield put(issuesActions.setIssuesFetching(false));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchFetchIssuesRequest(): Generator<*, *, *> {
  yield takeEvery(types.FETCH_ISSUES_REQUEST, fetchIssues);
}

export function* fetchRecentIssues(): Generator<*, *, *> {
  try {
    yield put(issuesActions.setIssuesFetching(true));
    const selectedProject: Project = yield select(getSelectedProject);
    const selectedSprintId: Id = yield select(getSelectedSprintId);
    const self: User = yield select(getUserData);
    const opts = {
      projectId: selectedProject.id,
      projectType: selectedProject.type || 'project',
      sprintId: selectedSprintId,
      worklogAuthor: self.key,
    };
    const response = yield call(Api.fetchRecentIssues, opts);

    const incompleteIssues = response.issues.filter(issue => issue.fields.worklog.total > 20);
    if (incompleteIssues.length) {
      /* TODO
      yield fork(
        getAdditionalWorklogsForIssues,
        {
          incompleteIssues,
          fillIssuesType: types.MERGE_RECENT_ISSUES,
          fillWorklogsType: types.MERGE_RECENT_WORKLOGS,
        },
      ); */
    }
    const normalizedIssues = yield call(normalizePayload, response.issues, 'issues');
    yield put(issuesActions.addIssues(normalizedIssues));
    yield put(issuesActions.fillRecentIssueIds(normalizedIssues.ids));
    /* TODO
    if (showWorklogTypes) {
      const recentWorkLogsIds = yield select(
        state => state.worklogs.meta.recentWorkLogsIds.toArray(),
      );
      const worklogsFromChronosBackend
        = yield call(fetchChronosBackendWorklogs, recentWorkLogsIds);
      yield put({
        type: types.MERGE_WORKLOGS_TYPES,
        payload: worklogsFromChronosBackend.filter(w => w.worklogType),
      });
    }
    const allWorklogs = yield select(state => state.worklogs.byId);
    setLoggedTodayOnTray(allWorklogs, worklogAuthor); */
    yield put(issuesActions.setIssuesFetching(false));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* fetchIssueTypes(): Generator<*, *, *> {
  try {
    const issueTypes = yield call(Api.fetchIssueTypes);
    console.log('issuesTypes', issueTypes);
    const normalizedData = normalizePayload(issueTypes, 'issueTypes');
    yield put(issuesActions.fillIssueTypes(normalizedData));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* fetchIssueStatuses(): Generator<*, *, *> {
  try {
    const issueStatuses = yield call(Api.fetchIssueStatuses);
    console.log('issueStatuses', issueStatuses);
    const normalizedData = normalizePayload(issueStatuses, 'issueStatuses');
    yield put(issuesActions.fillIssueStatuses(normalizedData));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

function* onSidebarTabChange({ payload }: { payload: string }): Generator<*, *, *> {
  try {
    const tab: string = payload;
    const recentIssueIds: Array<Id> = yield select(getRecentIssueIds);
    if (tab === 'recent' && recentIssueIds.length === 0) {
      yield fork(fetchRecentIssues);
    }
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchSidebarTabChange(): Generator<*, *, *> {
  yield takeEvery(types.SET_SIDEBAR_TYPE, onSidebarTabChange);
}

function* handleIssueFiltersChange(): Generator<*, *, *> {
  yield call(delay, 500);
  yield put(issuesActions.fetchIssuesRequest({ startIndex: 0, stopIndex: 10, search: true }));
}

export function* watchFiltersChange(): Generator<*, *, *> {
  yield takeLatest(
    [types.SET_ISSUES_SEARCH_VALUE, types.SET_ISSUES_FILTER],
    handleIssueFiltersChange,
  );
}

