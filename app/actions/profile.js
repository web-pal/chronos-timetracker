// @flow
import type {
  ProfileAction,
  User,
} from 'types';

import * as actionTypes from './actionTypes';


export const fillUserData = (
  payload: User,
): ProfileAction => ({
  type: actionTypes.FILL_USER_DATA,
  payload,
});
