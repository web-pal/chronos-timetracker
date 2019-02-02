import {
  put,
  select,
  call,
  fork,
  takeEvery,
} from 'redux-saga/effects';

import createActionCreators from 'redux-resource-action-creators';

import {
  types,
  uiActions,
  resourcesActions,
  issuesActions,
} from 'actions';
import {
  getResourceItemById,
} from 'selectors';

import {
  jiraApi,
} from 'api';
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
    const filters = yield call(jiraApi.getFavouriteFilters);
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

export function* saveFilter({
  name,
  jql,
  filterId,
}): Generator<*, *, *> {
  const actions = createActionCreators(
    filterId
      ? 'update'
      : 'create',
    {
      resourceType: 'filters',
      request: (
        filterId
          ? 'updateFilter'
          : 'createFilter'
      ),
      list: 'allFilters',
    },
  );
  try {
    yield put(actions.pending());
    const data = (
      filterId
        ? yield select(getResourceItemById('filters', filterId))
        : {
          name,
          description: 'Filter created in Chronos desktop',
          jql,
          favourite: true,
          favouritedCount: 0,
        }
    );
    const filter = yield call(
      filterId
        ? jiraApi.updateFilter
        : jiraApi.createFilter,
      {
        ...(
          filterId
            ? {
              params: {
                filterId,
              },
            } : {}
        ),
        body: {
          ...data,
          jql,
        },
      },
    );
    yield fork(notify, {
      title: `Save filter ${filter.name}`,
    });
    yield put(actions.succeeded({
      resources: [filter],
    }));
    yield put(uiActions.setUiState('saveFilterDialogOpen', false));
    yield put(uiActions.setUiState('issuesSourceId', filter.id));
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
        title: 'Failed to save filter',
        description: `${errObj.body.errorMessages.length} errors`,
      });
      yield put(uiActions.setUiState('newJQLFilterErrors', errObj.body.errorMessages));
    } else {
      yield fork(notify, {
        title: 'Failed to save filter',
        description: R.values(errObj.body.errors).join('\n'),
      });
    }
    yield call(throwError, err);
  }
}

export function* takeSaveFilterRequest(): Generator<*, *, *> {
  yield takeEvery(types.SAVE_FILTER_REQUEST, saveFilter);
}
