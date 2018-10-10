// @flow
import {
  call,
  select,
  put,
  takeEvery,
} from 'redux-saga/effects';
import createActionCreators from 'redux-resource-action-creators';

import * as Api from 'api';

import type {
  Id,
} from 'types';

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
    yield put(actions.pending());

    const boardId: Id = yield select(getUiState('issuesSourceId'));
    const response = yield call(Api.fetchSprints, { boardId });
    yield put(actions.succeeded({
      resources: response.values,
    }));
  } catch (err) {
    yield put(actions.succeeded({
      resources: [],
    }));
    yield call(throwError, err);
  }
}

export function* watchFetchSprintsRequest(): Generator<*, *, *> {
  yield takeEvery(actionTypes.FETCH_SPRINTS_REQUEST, fetchSprints);
}
