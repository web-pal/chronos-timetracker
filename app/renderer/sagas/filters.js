import * as eff from 'redux-saga/effects';
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
    yield eff.put(actions.pending());
    const filters = yield eff.call(jiraApi.getFavouriteFilters);
    yield eff.put(actions.succeeded({
      resources: filters,
    }));
  } catch (err) {
    throwError(err);
    yield err.fork(notify, {
      title: 'Failed to load filters, check your permissions',
    });
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
    yield eff.put(actions.pending());
    const data = (
      filterId
        ? yield eff.select(getResourceItemById('filters', filterId))
        : {
          name,
          description: 'Filter created in Chronos desktop',
          jql,
          favourite: true,
          favouritedCount: 0,
        }
    );
    const filter = yield eff.call(
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
    yield eff.fork(notify, {
      title: `Save filter ${filter.name}`,
    });
    yield eff.put(actions.succeeded({
      resources: [filter],
    }));
    yield eff.put(uiActions.setUiState({
      saveFilterDialogOpen: false,
      issuesSourceId: filter.id,
      filterStatusesIsFetched: false,
    }));
    yield eff.put(resourcesActions.clearResourceList({
      resourceType: 'issues',
      list: 'recentIssues',
    }));
    yield eff.put(issuesActions.refetchIssuesRequest());
  } catch (err) {
    throwError(err);
    yield eff.put(actions.failed());
    const errObj = JSON.parse(err);
    if (errObj.body.errorMessages.length > 0) {
      yield eff.fork(notify, {
        title: 'Failed to save filter',
        description: `${errObj.body.errorMessages.length} errors`,
      });
      yield eff.put(uiActions.setUiState({
        newJQLFilterErrors: errObj.body.errorMessages,
      }));
    } else {
      yield eff.fork(notify, {
        title: 'Failed to save filter',
        description: R.values(errObj.body.errors).join('\n'),
      });
    }
  }
}

export function* takeSaveFilterRequest(): Generator<*, *, *> {
  yield eff.takeEvery(types.SAVE_FILTER_REQUEST, saveFilter);
}
