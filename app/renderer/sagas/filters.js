import {
  put,
  call,
  fork,
  take,
} from 'redux-saga/effects';

import createActionCreators from 'redux-resource-action-creators';

import {
  types,
  uiActions,
  resourcesActions,
  issuesActions,
} from 'actions';

import * as Api from 'api';
import * as R from 'ramda';

import {
  throwError,
  notify,
} from './ui';

export function* fetchFilters(): Generator<*, *, *> {
  try {
    const actions = createActionCreators('read', {
      resourceType: 'filters',
      request: 'allFilters',
      list: 'allFilters',
    });
    yield put(actions.pending());
    // console.log('fetchFilters');
    const filters = yield call(Api.fetchFilters);
    // console.log(filters);
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
    const actions = createActionCreators('create', {
      resourceType: 'filters',
      request: 'createFilter',
      list: 'allFilters',
    });
    try {
      const { payload: { name, jql } } = yield take(types.CREATE_FILTER_REQUEST);
      const newFilter = {
        name,
        description: 'Filter created in Chronos desktop',
        jql,
        favourite: true,
        favouritedCount: 0,
      };
      yield put(actions.pending());
      const created = yield call(Api.createFilter, newFilter);
      yield fork(notify, {
        title: `Created filter ${name}`,
      });
      yield put(actions.succeeded({
        resources: [created],
      }));
      yield put(uiActions.setUiState('saveFilterDialogOpen', false));
      yield put(uiActions.setUiState('issuesSourceId', created.id));
      yield put(uiActions.setUiState('filterStatusesIsFetched', false));
      yield put(resourcesActions.clearResourceList({
        resourceType: 'issues',
        list: 'recentIssues',
      }));
      yield put(issuesActions.refetchIssuesRequest());
    } catch (err) {
      yield put(actions.failed());
      const errObj = JSON.parse(err);
      if (errObj.body.errorMessages.length > 0) {
        yield fork(notify, {
          title: 'Failed to create filter',
          description: `${errObj.body.errorMessages.length} errors`,
        });
        yield put(uiActions.setUiState('newJQLFilterErrors', errObj.body.errorMessages));
      } else {
        yield fork(notify, {
          title: 'Failed to create filter',
          description: R.values(errObj.body.errors).join('\n'),
        });
      }
      yield call(throwError, err);
    }
  }
}

export function* updateFilterFlow(): Generator<*, *, *> {
  while (true) {
    const actions = createActionCreators('update', {
      resourceType: 'filters',
      request: 'updateFilter',
      list: 'allFilters',
    });
    try {
      const { payload: { oldFilter, newJQLString } } = yield take(types.UPDATE_FILTER_REQUEST);
      const newFilter = {
        name: oldFilter.name,
        description: oldFilter.description,
        jql: newJQLString,
        favourite: oldFilter.favourite,
        favouritedCount: oldFilter.favouritedCount,
      };
      yield put(actions.pending());
      const updated = yield call(Api.updateFilter, oldFilter.id, newFilter);
      yield fork(notify, {
        title: `Updated filter ${oldFilter.name}`,
      });
      yield put(uiActions.setUiState('newJQLFilterValue', null));
      yield put(actions.succeeded({
        resources: [updated],
      }));
      yield put(uiActions.setUiState('filterStatusesIsFetched', false));
      yield put(resourcesActions.clearResourceList({
        resourceType: 'issues',
        list: 'recentIssues',
      }));
      yield put(issuesActions.refetchIssuesRequest());
    } catch (err) {
      yield put(actions.failed());
      const errObj = JSON.parse(err);
      if (errObj.body.errorMessages.length > 0) {
        yield fork(notify, {
          title: 'Failed to update filter',
          description: `${errObj.body.errorMessages.length} errors`,
        });
        yield put(uiActions.setUiState('newJQLFilterErrors', errObj.body.errorMessages));
      } else {
        yield fork(notify, {
          title: 'Failed to update filter',
          description: R.values(errObj.body.errors).join('\n'),
        });
      }
      yield call(throwError, err);
    }
  }
}
