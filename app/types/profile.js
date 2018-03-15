// @flow
import * as actionTypes from '../actions/actionTypes/profile';

export type User = {
  accountId: string,
  active: boolean,
  applicationRoles?: {
    size: number,
    items: Array<any>,
  },
  avatarUrls: {
    '16x16': string,
    '24x24': string,
    '32x32': string,
    '48x48': string,
  },
  displayName: string,
  emailAddress: string,
  expand?: string,
  groups?: {
    size: number,
    items: Array<any>,
  },
  key: string,
  name: string,
  locale?: string,
  self: string,
  timeZone: string,
};

export type ProfileAction =
  {|
    type: typeof actionTypes.FILL_USER_DATA,
    payload: User,
  |};

export type ProfileState = {|
  userData: User | null,
|};
