// @flow
import type {
  UsersAction,
} from 'types';

import * as actionTypes from './actionTypes';

export const showTeamStatusWindow = (): UsersAction => ({
  type: actionTypes.SHOW_TEAM_STATUS_WINDOW,
});

export const hideTeamStatusWindow = (): UsersAction => ({
  type: actionTypes.HIDE_TEAM_STATUS_WINDOW,
});

export const fetchUsersRequest = ({ userIds }): UsersAction => ({
  type: actionTypes.FETCH_USERS_REQUEST,
  payload: {
    userIds,
  },
});

export const updateUserTimezone = ({
  userId,
  timezone,
}): UsersAction => ({
  type: actionTypes.UPDATE_USER_TIMEZONE_REQUEST,
  payload: {
    userId,
    timezone,
  },
  scope: 'mainRenderer',
})

export const setTeamStatusUsers = ({
  teamStatusUsers,
  scope,
}): UsersAction => ({
  type: actionTypes.SET_TEAM_STATUS_USERS,
  payload: {
    teamStatusUsers,
  },
  scope,
});
