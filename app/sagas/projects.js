// @flow
import {
  put,
  call,
  select,
  takeLatest,
} from 'redux-saga/effects';
import Raven from 'raven-js';
import createActionCreators from 'redux-resource-action-creators';

import {
  types,
  uiActions,
} from 'actions';
import {
  getResourceMap,
  getUiState,
  getCurrentProjectId,
} from 'selectors';
import * as Api from 'api';

import {
  throwError,
  notify,
} from './ui';


export function* fetchProjects(): Generator<*, *, *> {
  try {
    const actions = createActionCreators('read', {
      resourceName: 'projects',
      request: 'allProjects',
      list: 'allProjects',
    });
    yield put(actions.pending());
    const projects = yield call(Api.fetchProjects);
    yield put(actions.succeeded({
      resources: projects,
    }));
  } catch (err) {
    yield call(notify, '', 'Failed to load projects, check your permissions');
    yield call(throwError, err);
    Raven.captureException(err);
  }
}


export function* fetchProjectStatuses(): Generator<*, *, *> {
  const typesActions = createActionCreators('read', {
    resourceName: 'issuesTypes',
    request: 'issuesTypes',
    list: 'issuesTypes',
    mergeListIds: false,
  });
  const statusesActions = createActionCreators('read', {
    resourceName: 'issuesStatuses',
    request: 'issuesStatuses',
    list: 'issuesStatuses',
    mergeListIds: false,
  });
  try {
    const projectId = yield select(getCurrentProjectId);
    if (projectId) {
      yield put(typesActions.pending());
      yield put(statusesActions.pending());

      const metadata = yield call(Api.getIssuesMetadata, projectId);
      const issuesTypes = metadata.projects[0].issuetypes;

      const statusesResponse = yield call(Api.fetchProjectStatuses, projectId);
      const statuses = [].concat(...statusesResponse.map(s => s.statuses));
      const uniqueStatuses =
        statuses.reduce((acc, s) => {
          acc[s.id] = s;
          return acc;
        }, {});

      yield put(typesActions.succeeded({
        resources: issuesTypes,
      }));
      yield put(statusesActions.succeeded({
        resources: Object.keys(uniqueStatuses).map(id => uniqueStatuses[id]),
      }));
      yield put(uiActions.setUiState('filterStatusesIsFetched', true));
    }
  } catch (err) {
    yield call(throwError, err);
  }
}


export function* watchFetchProjectStatusesRequest(): Generator<*, *, *> {
  yield takeLatest(types.FETCH_PROJECT_STATUSES_REQUEST, fetchProjectStatuses);
}
