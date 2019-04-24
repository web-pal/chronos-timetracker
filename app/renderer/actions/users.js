// @flow
import type {
  UsersAction,
} from 'types';

import * as actionTypes from './actionTypes';

export const fetchUsersRequest = ({ userIds }): UsersAction => ({
  type: actionTypes.FETCH_USERS_REQUEST,
  payload: {
    userIds,
  },
});
