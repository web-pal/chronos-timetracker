// @flow
import * as eff from 'redux-saga/effects';
import createActionCreators from 'redux-resource-action-creators';

import type {
  Id,
} from 'types';

import {
  jiraApi,
} from 'api';
import {
  getUiState,
} from 'selectors';
import {
  actionTypes,
} from 'actions';

import {
  throwError,
} from './ui';


export function* fetchSprints(): Generator<*, *, *> {
  const actions = createActionCreators('read', {
    resourceType: 'sprints',
    request: 'allSprints',
    list: 'allSprints',
  });
  try {
    yield eff.put(actions.pending());

    const boardId: Id = yield eff.select(getUiState('issuesSourceId'));
    const response = yield eff.call(
      jiraApi.getBoardSprints,
      {
        params: {
          boardId,
        },
      },
    );
    yield eff.put(actions.succeeded({
      resources: response.values,
    }));
  } catch (err) {
    yield eff.put(actions.succeeded({
      resources: [],
    }));
    yield eff.call(throwError, err);
  }
}

export function* watchFetchSprintsRequest(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.FETCH_SPRINTS_REQUEST, fetchSprints);
}
