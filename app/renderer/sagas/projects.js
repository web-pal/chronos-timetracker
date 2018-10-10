// @flow
import {
  put,
  call,
  select,
  takeLatest,
  fork,
} from 'redux-saga/effects';
import Raven from 'raven-js';
import createActionCreators from 'redux-resource-action-creators';

import {
  actionTypes,
  uiActions,
} from 'actions';
import {
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
      resourceType: 'projects',
      request: 'allProjects',
      list: 'allProjects',
    });
    yield put(actions.pending());
    const projects = yield call(Api.fetchProjects);
    yield put(actions.succeeded({
      resources: projects,
    }));
  } catch (err) {
    yield fork(notify, {
      title: 'Failed to load projects, check your permissions',
    });
    yield call(throwError, err);
  }
}


export function* fetchProjectStatuses(): Generator<*, *, *> {
  const typesActions = createActionCreators('read', {
    resourceType: 'issuesTypes',
    request: 'issuesTypes',
    list: 'issuesTypes',
    mergeListIds: false,
  });
  const statusesActions = createActionCreators('read', {
    resourceType: 'issuesStatuses',
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
      // Some users have strange metada response, it needs to detect issue
      if (
        !metadata ||
        !metadata.projects ||
        !metadata.projects[0] ||
        !metadata.projects[0].issuetypes
      ) {
        Raven.captureMessage('Issue types empty!', {
          level: 'error',
          extra: {
            metadata,
            projectId,
          },
        });
      } else {
        const issuesTypes = metadata.projects[0].issuetypes;
        yield put(typesActions.succeeded({
          resources: issuesTypes,
        }));
      }

      const statusesResponse = yield call(
        Api.fetchProjectStatuses,
        projectId,
      );
      const statuses = [].concat(...statusesResponse.map(s => s.statuses));
      const uniqueStatuses =
        statuses.reduce((acc, s) => {
          acc[s.id] = s;
          return acc;
        }, {});

      yield put(statusesActions.succeeded({
        resources: Object.keys(uniqueStatuses).map(id => uniqueStatuses[id]),
      }));
      yield put(uiActions.setUiState('filterStatusesIsFetched', true));
    }
  } catch (err) {
    yield put(typesActions.succeeded({
      resources: [],
    }));
    yield put(statusesActions.succeeded({
      resources: [],
    }));
    yield put(uiActions.setUiState('filterStatusesIsFetched', true));
    yield call(throwError, err);
  }
}


export function* watchFetchProjectStatusesRequest(): Generator<*, *, *> {
  yield takeLatest(actionTypes.FETCH_PROJECT_STATUSES_REQUEST, fetchProjectStatuses);
}
