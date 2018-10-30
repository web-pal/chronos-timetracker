// @flow
import * as actionTypes from '../actions/actionTypes/auth';


export type AuthAction =
  {|
    type: typeof actionTypes.AUTH_REQUEST,
    payload: {|
      host: any,
      token: string,
    |},
  |} |
  {|
    type: typeof actionTypes.LOGOUT_REQUEST,
    payload: {
      dontForget: boolean,
    }
  |} |
  {|
    type: typeof actionTypes.SWITCH_ACCOUNT,
    payload: {|
      host: string,
      username: string,
    |}
  |} |
  {|
    type: typeof actionTypes.ADD_AUTH_DEBUG_MESSAGE,
    payload: Array<*>,
  |};

export type Account = {
  name: string,
  protocol: string,
  hostname: string,
  port: string | number,
  pathname: string,
};
