// @flow
import type {
  ResourcesAction,
} from 'types';

import * as actionTypes from './actionTypes/resources';


export const clearResourceList = ({
  list,
  resourceName,
}: {|
  list: string,
  resourceName: string,
|}): ResourcesAction => ({
  type: actionTypes.CLEAR_RESOURCES_LIST,
  list,
  resourceName,
});

export const setResourceMeta = ({
  meta,
  resourceName,
  resources,
}: {|
  meta: any,
  resourceName: string,
  resources?: Array<string | number>,
|}): ResourcesAction => ({
  type: actionTypes.SET_RESOURCES_META,
  meta,
  resourceName,
  resources,
});
