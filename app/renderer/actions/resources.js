// @flow
import type {
  ResourcesAction,
} from 'types';

import * as actionTypes from './actionTypes/resources';


export const clearResourceList = ({
  list,
  resourceType,
}: {|
  list: string,
  resourceType: string,
|}): ResourcesAction => ({
  type: actionTypes.CLEAR_RESOURCES_LIST,
  list,
  resourceType,
});

export const setResourceMeta = ({
  meta,
  resourceType,
  resources,
}: {|
  meta: any,
  resourceType: string,
  resources?: Array<string | number>,
|}): ResourcesAction => ({
  type: actionTypes.SET_RESOURCES_META,
  meta,
  resourceType,
  resources,
});
