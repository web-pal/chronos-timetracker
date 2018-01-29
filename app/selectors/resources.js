import {
  createSelector,
} from 'reselect';

export const getResourceIds = (resourceName, listName) =>
  state => state[resourceName].lists[listName];

export const getResourceMap = resourceName =>
  state => state[resourceName].resources;

export const getResourceMeta = (resourceName, metaKey) =>
  state => state[resourceName].meta[metaKey];

const resourceSelectors = {};

export const getResourceMappedList = (resourceName, listName) => {
  if (resourceSelectors[resourceName]) {
    return resourceSelectors[`${resourceName}${listName}`];
  }
  resourceSelectors[`${resourceName}${listName}`] =
    createSelector(
      [
        getResourceIds(resourceName, listName),
        getResourceMap(resourceName),
      ],
      (ids, map) => ids.map(id => map[id]),
    );
  return resourceSelectors[`${resourceName}${listName}`];
};
