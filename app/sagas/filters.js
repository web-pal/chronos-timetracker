import {
  put,
  call,
  fork,
  take,
} from 'redux-saga/effects';

import createActionCreators from 'redux-resource-action-creators';

import { types, uiActions } from 'actions';

import * as Api from 'api';

import {
  throwError,
  notify,
} from './ui';

export function* fetchFilters(): Generator<*, *, *> {
  try {
    const actions = createActionCreators('read', {
      resourceName: 'filters',
      request: 'allFilters',
      list: 'allFilters',
    });
    yield put(actions.pending());
    console.log('fetchFilters');
    const filters = yield call(Api.fetchFilters);
    console.log(filters);
    yield put(actions.succeeded({
      resources: filters,
    }));
  } catch (err) {
    yield fork(notify, {
      title: 'Failed to load filters, check your permissions',
    });
    yield call(throwError, err);
  }
}

export function* createFilterFlow(): Generator<*, *, *> {
  while (true) {
    try {
      const { payload: { name, jql } } = yield take(types.CREATE_FILTER_REQUEST);
      const actions = createActionCreators('create', {
        resourceName: 'filters',
        request: 'createFilter',
        list: 'allFilters',
      });
      const newFilter = {
        name,
        description: 'Filter created in Chronos desktop',
        jql,
        favourite: true,
        favouritedCount: 0,
      };
      yield put(actions.pending());
      const created = yield call(Api.createFilter, newFilter);
      console.log(created);
      yield put(actions.succeeded({
        resources: [created],
      }));
    } catch (err) {
      yield fork(notify, {
        title: 'Failed to create filter, check your permissions',
      });
      const errObj = JSON.parse(err);
      console.log(errObj);
      yield put(uiActions.setUiState('newJQLFilterErrors', errObj.body.errorMessages))
      yield call(throwError, err);
    }
  }
}
