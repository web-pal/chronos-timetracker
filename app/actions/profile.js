// @flow
import type {
  ProfileAction,
} from '../types/profile';

import * as actionTypes from './actionTypes';


export const fillUserData = (
  payload: any,
): ProfileAction => ({
  type: actionTypes.FILL_USER_DATA,
  payload,
});
