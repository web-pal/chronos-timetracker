// @flow
import * as eff from 'redux-saga/effects';
import * as Sentry from '@sentry/electron';
import createActionCreators from 'redux-resource-action-creators';

import {
  actionTypes,
  uiActions,
} from 'actions';
import {
  getCurrentProjectId,
} from 'selectors';

import {
  jiraApi,
} from 'api';


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
    yield eff.put(actions.pending());
    const projects = yield eff.call(jiraApi.getAllProjects);
    yield eff.put(actions.succeeded({
      resources: projects,
    }));
  } catch (err) {
    yield eff.fork(notify, {
      title: 'Failed to load projects, check your permissions',
    });
    yield eff.call(throwError, err);
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
    const projectId = yield eff.select(getCurrentProjectId);
    if (projectId) {
      yield eff.put(typesActions.pending());
      yield eff.put(statusesActions.pending());

      const metadata = yield eff.call(
        jiraApi.getCreateIssueMetadata,
        {
          params: {
            projectIds: projectId,
          },
        },
      );
      // Some users have strange metada response, it needs to detect issue
      if (
        !metadata
        || !metadata.projects
        || !metadata.projects[0]
        || !metadata.projects[0].issuetypes
      ) {
        Sentry.captureMessage('Issue types empty!', {
          level: 'error',
          extra: {
            metadata,
            projectId,
          },
        });
      } else {
        const issuesTypes = metadata.projects[0].issuetypes;
        yield eff.put(typesActions.succeeded({
          resources: issuesTypes,
        }));
      }

      const statusesResponse = yield eff.call(
        jiraApi.getProjectStatuses,
        {
          params: {
            projectIdOrKey: projectId,
          },
        },
      );
      const statuses = [].concat(...statusesResponse.map(s => s.statuses));
      const uniqueStatuses = (
        statuses.reduce((acc, s) => {
          acc[s.id] = s;
          return acc;
        }, {})
      );

      yield eff.put(statusesActions.succeeded({
        resources: Object.keys(uniqueStatuses).map(id => uniqueStatuses[id]),
      }));
      yield eff.put(uiActions.setUiState({
        filterStatusesIsFetched: true,
      }));
    }
  } catch (err) {
    yield eff.put(typesActions.succeeded({
      resources: [],
    }));
    yield eff.put(statusesActions.succeeded({
      resources: [],
    }));
    yield eff.put(uiActions.setUiState({
      filterStatusesIsFetched: true,
    }));
    yield eff.call(throwError, err);
  }
}


export function* watchFetchProjectStatusesRequest(): Generator<*, *, *> {
  yield eff.takeLatest(actionTypes.FETCH_PROJECT_STATUSES_REQUEST, fetchProjectStatuses);
}
