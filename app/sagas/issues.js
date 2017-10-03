// @flow
import { call, select, put, takeEvery } from 'redux-saga/effects';
import * as Api from 'api';
import Raven from 'raven-js';
import { getSelectedProject, getSelectedSprintId } from 'selectors';
import { issuesActions, types } from 'actions';
import normalizePayload from 'normalize-util';

import { throwError } from './ui';

import type { FetchIssuesRequestAction, Project, Id } from '../types';

export function* fetchIssues({
  payload: { startIndex, stopIndex },
}: FetchIssuesRequestAction): Generator<*, *, *> {
  try {
    yield put(issuesActions.setIssuesFetching(true));
    const selectedProject: Project = yield select(getSelectedProject);
    const selectedSprintId: Id = yield select(getSelectedSprintId);
    const opts = {
      startIndex,
      stopIndex,
      projectId: selectedProject.id,
      projectType: selectedProject.type || 'project',
      sprintId: selectedSprintId,
    };
    console.log(opts);
    const response = yield call(Api.fetchIssues, opts);
    const normalizedIssues = yield call(normalizePayload, response.issues, 'issues');
    yield put(issuesActions.fillIssues(normalizedIssues));
    yield put(issuesActions.setIssuesFetching(false));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchFetchIssuesRequest(): Generator<*, *, *> {
  yield takeEvery(types.FETCH_ISSUES_REQUEST, fetchIssues);
}
