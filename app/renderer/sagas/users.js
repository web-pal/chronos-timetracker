// @flow
import * as eff from 'redux-saga/effects';

import {
  jiraApi,
} from 'api';

import {
  actionTypes,
  uiActions,
} from 'actions';

import {
  throwError,
} from './ui';

export function* fetchUsers({ payload: { userIds } }): Generator<*, *, *> {
  yield eff.put(uiActions.setUiState({ isUsersFetching: true }));
  try {
    const users = yield eff.all(
      userIds.map(
        id => eff.call(jiraApi.getUserByAccountId, { params: { accountId: id } }),
      ),
    );

    const filteredUsers = users.map(({
      avatarUrls,
      accountId,
      displayName,
      timeZone,
    }) => ({ avatarUrls, accountId, displayName, timeZone }));

    yield eff.put({
      type: actionTypes.SET_UI_STATE,
      payload: {
        keyOrRootValues: { usersInTeamStatusWindow: filteredUsers },
      },
      scope: 'allRenderer',
    });
  } catch (err) {
    yield eff.call(throwError, err);
  } finally {
    yield eff.put(uiActions.setUiState({ isUsersFetching: false }));
  }
}

export function* watchFetchUsers(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.FETCH_USERS_REQUEST, fetchUsers);
}
