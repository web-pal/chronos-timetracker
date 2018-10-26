// @flow
import {
  createSelector,
} from 'reselect';

import type {
  Id,
  Sprint,
  SprintsResources,
} from '../types';

import {
  getResourceMappedList,
  getResourceMap,
} from './resources';
import {
  getUiState,
} from './ui';


export const getSprintsOptions = createSelector(
  [getResourceMappedList('sprints', 'allSprints')],
  (sprints: Array<Sprint>) =>
    [{
      heading: 'Sprints',
      items: sprints.map(sprint =>
        ({
          value: sprint.id,
          content: sprint.name,
          meta: {
            sprint,
          },
        })),
    }],
);

export const getSelectedSprintOption = createSelector(
  [
    getUiState('issuesSprintId'),
    getResourceMap('sprints'),
  ],
  (
    sprintId: Id,
    sprintsMap: SprintsResources,
  ) => {
    if (!sprintId) {
      return null;
    }
    const sprint = sprintsMap[sprintId];
    if (!sprint) {
      return null;
    }
    return {
      value: sprint.id,
      content: sprint.name,
      meta: {
        sprint,
      },
    };
  },
);

