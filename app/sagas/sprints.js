// @flow
import {
  call,
  select,
  put,
  takeEvery,
} from 'redux-saga/effects';
import createActionCreators from 'redux-resource-action-creators';

import {
  getUiState,
} from 'selectors';
import {
  types,
} from 'actions';

import * as Api from 'api';
import {
  throwError,
} from './ui';


export function* fetchSprints(): Generator<*, *, *> {
  const actions = createActionCreators('read', {
    resourceName: 'sprints',
    request: 'allSprints',
    list: 'allSprints',
  });
  try {
    yield put(actions.pending());

    const boardId: string | null = yield select(getUiState('issuesSourceId'));
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
  yield takeEvery(types.FETCH_SPRINTS_REQUEST, fetchSprints);
}
