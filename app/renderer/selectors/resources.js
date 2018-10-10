// @flow
import {
  createSelector,
} from 'reselect';

import type {
  Id,
  State,
} from 'types';


export const getResourceIds = (
  resourceType: string,
  listName: string,
) =>
  (state: State) =>
    state[resourceType].lists[listName];

export const getResourceMap = (resourceType: string) =>
  (state: State) =>
    state[resourceType].resources;

export const getResourceMeta = (
  resourceType: string,
  metaKey: string,
) =>
  (state: State) =>
    state[resourceType].meta[metaKey];

const resourceSelectors = {};

export const getResourceMappedList = (
  resourceType: string,
  listName: string,
) => {
  if (resourceSelectors[`${resourceType}${listName}`]) {
    return resourceSelectors[`${resourceType}${listName}`];
  }
  resourceSelectors[`${resourceType}${listName}`] =
    createSelector(
      [
        getResourceIds(resourceType, listName),
        getResourceMap(resourceType),
      ],
      (ids = [], map) => ids.map(id => map[id]),
    );
  return resourceSelectors[`${resourceType}${listName}`];
};

export const getResourceItemById = (
  resourceType: string,
  id: Id,
) =>
  (state: State) =>
    state[resourceType].resources[id] || null;
