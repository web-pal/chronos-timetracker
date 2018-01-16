// @flow
import type {
  FillUserData, FillUserDataAction,
  SetHost, SetHostAction,
  SetIsPaidUser, SetIsPaidUserAction,
  User,
} from '../types';

import * as types from './actionTypes/';

export const setHost: SetHost = (
  payload: URL,
): SetHostAction => ({
  type: types.SET_HOST,
  payload,
});

export const fillUserData: FillUserData = (
  payload: User,
): FillUserDataAction => ({
  type: types.FILL_USER_DATA,
  payload,
});

export const setIsPaidUser: SetIsPaidUser = (
  payload: boolean,
): SetIsPaidUserAction => ({
  type: types.SET_IS_PAID_USER,
  payload,
});
