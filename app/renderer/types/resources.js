// @flow
import * as actionTypes from '../actions/actionTypes/resources';


export type ResourcesAction =
  {|
    type: typeof actionTypes.CLEAR_RESOURCES_LIST,
    list: string,
    resourceType: string,
  |} |
  {|
    type: typeof actionTypes.SET_RESOURCES_META,
    meta: any,
    resourceType: string,
    resources?: Array<string | number>,
  |};
