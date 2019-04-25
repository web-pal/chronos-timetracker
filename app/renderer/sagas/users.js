// @flow
import * as eff from 'redux-saga/effects';

import {
  jiraApi,
} from 'api';

import {
  actionTypes,
  uiActions,
  usersActions,
} from 'actions';

import {
  getUiState,
} from 'selectors';

import {
  throwError,
} from './ui';

export function* updateUsers({ newUsers }): Generator<*, *, *> {
  try {
    const currentTeamStatusWindowId = yield eff.select(getUiState('teamStatusWindowId'));

    yield eff.put(uiActions.setUiState({
      usersInTeamStatusWindow: newUsers,
    }));

    yield eff.put(usersActions.setTeamStatusUsers({
      teamStatusUsers: newUsers,
      scope: currentTeamStatusWindowId,
    }));
  } catch (err) {
    yield eff.call(throwError, err);
  }
}


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

    yield eff.call(updateUsers, { newUsers: filteredUsers });
  } catch (err) {
    yield eff.call(throwError, err);
  } finally {
    yield eff.put(uiActions.setUiState({ isUsersFetching: false }));
  }
}

export function* updateUserTimezone({ payload: { userId, timezone } }): Generator<*, *, *> {
  try {
    const users = yield eff.select(getUiState('usersInTeamStatusWindow'));
    const newUsers = users.map((user) => {
      if (user.accountId === userId) {
        const { timeZone, ...rest} = user;
        return { 
          timeZone: timezone,
          ...rest,
        }
      }
      return user;
    });

    yield eff.call(updateUsers, { newUsers });
  } catch (err) {
    yield eff.call(throwError, err);
  }
}

export function* watchUpdateUserTimezone(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.UPDATE_USER_TIMEZONE_REQUEST, updateUserTimezone);
}

export function* watchFetchUsers(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.FETCH_USERS_REQUEST, fetchUsers);
}
