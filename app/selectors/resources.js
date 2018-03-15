// @flow
import {
  createSelector,
} from 'reselect';

import type {
  Id,
  State,
} from 'types';


export const getResourceIds = (
  resourceName: string,
  listName: string,
) =>
  (state: State) =>
    state[resourceName].lists[listName];

export const getResourceMap = (resourceName: string) =>
  (state: State) =>
    state[resourceName].resources;

export const getResourceMeta = (
  resourceName: string,
  metaKey: string,
) =>
  (state: State) =>
    state[resourceName].meta[metaKey];

const resourceSelectors = {};

export const getResourceMappedList = (
  resourceName: string,
  listName: string,
) => {
  if (resourceSelectors[`${resourceName}${listName}`]) {
    return resourceSelectors[`${resourceName}${listName}`];
  }
  resourceSelectors[`${resourceName}${listName}`] =
    createSelector(
      [
        getResourceIds(resourceName, listName),
        getResourceMap(resourceName),
      ],
      (ids = [], map) => ids.map(id => map[id]),
    );
  return resourceSelectors[`${resourceName}${listName}`];
};

export const getResourceItemById = (
  resourceName: string,
  id: Id,
) =>
  (state: State) =>
    state[resourceName].resources[id] || null;
