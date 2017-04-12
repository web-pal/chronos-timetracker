import { createSelector } from 'reselect';

export const getProjectsMap = ({ projects }) => projects.byId;
export const getProjectsIds = ({ projects }) => projects.allIds;
export const getBoardsMap = ({ projects }) => projects.boardsById;
export const getBoardsIds = ({ projects }) => projects.allBoards;
export const getSprintsMap = ({ projects }) => projects.meta.sprintsById;
export const getSprintsIds = ({ projects }) => projects.meta.sprintsId;
export const getSelectedProjectId = ({ projects }) => projects.meta.get('selectedProjectId');
export const getSelectedProjectType = ({ projects }) => projects.meta.get('selectedProjectType');
export const getSelectedSprintId = ({ projects }) => projects.meta.get('selectedSprintId');

export const getProjects = createSelector(
  [getProjectsIds, getProjectsMap],
  (ids, map) => ids.map(id => map.get(id)),
);

export const getProjectsOptions = createSelector(
  [getProjectsIds, getProjectsMap],
  (ids, map) => [
    { divider: true, disabled: true, dividerName: 'Projects' },
    ...(ids.toArray().map(id => ({
      value: id,
      divider: false,
      label: map.getIn([id, 'name']),
      type: 'project',
    }))),
  ],
);
export const getBoardsOptions = createSelector(
  [getBoardsIds, getBoardsMap],
  (ids, map) => [
    { divider: true, disabled: true, dividerName: 'Boards' },
    ...(ids.toArray().map(id => ({
      value: id,
      divider: false,
      label: map.getIn([`${id}`, 'name']), // converting id to a string
      type: 'board',
    }))),
  ],
);

export const getSelectedProject = createSelector(
  [getSelectedProjectId, getProjectsMap],
  (id, map) => map.get(id) || Immutable.Map(),
);

export const getSelectedProjectOption = createSelector(
  [getSelectedProjectId, getSelectedProjectType, getProjectsMap, getBoardsMap],
  (id, type, projectsMap, boardsMap) => {
    const r = (id ? ({
      value: id,
      label: (type === 'board' ? boardsMap : projectsMap).getIn([`${id}`, 'name']),
    }) : null);
    return r;
  },
);

export const getSelectedSprintOption = createSelector(
  [getSelectedSprintId, getSprintsMap],
  (id, map) => (id ? ({
    value: id,
    label: map.getIn([`${id}`, 'name']),
  }) : null),
);

export const getSprints = createSelector(
  [getSprintsIds, getSprintsMap],
  (ids, map) => ids.map(id => ({
    value: id,
    label: map.getIn([`${id}`, 'name']),
  })).toArray(),
);
