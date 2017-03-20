import { createSelector } from 'reselect';

export const getProjectsMap = ({ projects }) => projects.byId;
export const getProjectsIds = ({ projects }) => projects.allIds;
export const getSelectedProjectId = ({ projects }) => projects.meta.get('selected');

export const getProjects = createSelector(
  [getProjectsIds, getProjectsMap],
  (ids, map) => ids.map(id => map.get(id)),
);

export const getProjectsOptions = createSelector(
  [getProjectsIds, getProjectsMap],
  (ids, map) => ids.toArray().map(id => ({ value: id, label: map.getIn([id, 'name']) })),
);

export const getSelectedProject = createSelector(
  [getSelectedProjectId, getProjectsMap],
  (id, map) => map.get(id) || Immutable.Map(),
);

export const getSelectedProjectOption = createSelector(
  [getSelectedProjectId, getProjectsMap],
  (id, map) => (id ? ({ value: id, label: map.getIn([id, 'name']) }) : null),
);
