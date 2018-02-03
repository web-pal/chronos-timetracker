// @flow
import * as actionTypes from '../actions/actionTypes/profile';


export type ProfileAction =
  {|
    type: typeof actionTypes.FILL_USER_DATA,
    payload: any,
  |};

export type User = any;

export type ProfileState = {|
  userData: User,
|};
