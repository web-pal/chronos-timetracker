// @flow
import * as actionTypes from '../actions/actionTypes/users';

export type UsersAction =
  {|
    type: typeof actionTypes.FETCH_USERS_REQUEST,
    payload: any,
  |}|
  {|
    type: typeof actionTypes.UPDATE_USER_TIMEZONE_REQUEST,
    payload: any,
  |}|
  {|
    type: typeof actionTypes.SET_TEAM_STATUS_USERS,
  |}|
  {|
    type: typeof actionTypes.SHOW_TEAM_STATUS_WINDOW,
    payload: any,
  |};
