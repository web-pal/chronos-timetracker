// @flow
import * as actionTypes from './actionTypes/resources';


export const clearResourceList = ({
  list,
  resourceName,
}) => ({
  type: actionTypes.CLEAR_RESOURCES_LIST,
  list,
  resourceName,
});

export const setResourceMeta = ({
  meta,
  resourceName,
}) => ({
  type: actionTypes.SET_RESOURCES_META,
  meta,
  resourceName,
});
