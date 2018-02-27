// @flow
import * as actionTypes from '../actions/actionTypes/resources';


export type ResourcesAction =
  {|
    type: typeof actionTypes.CLEAR_RESOURCES_LIST,
    list: string,
    resourceName: string,
  |} |
  {|
    type: typeof actionTypes.SET_RESOURCES_META,
    meta: any,
    resourceName: string,
    resources?: Array<string | number>,
  |};
