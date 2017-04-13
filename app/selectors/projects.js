import { createSelector } from 'reselect';

export const getProjectsMap = ({ projects }) => projects.byId;
export const getProjectsIds = ({ projects }) => projects.allIds;
export const getBoardsMap = ({ projects }) => projects.boardsById;
export const getScrumBoardsIds = ({ projects }) => projects.allScrumBoards;
export const getKanbanBoardsIds = ({ projects }) => projects.allKanbanBoards;
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
  (ids, map) => ids.size && [
    { divider: true, disabled: true, dividerName: 'Projects' },
    ...(ids.toArray().map(id => ({
      value: id,
      divider: false,
      label: map.getIn([id, 'name']),
      type: 'project',
    }))),
  ],
);
export const getScrumBoardsOptions = createSelector(
  [getScrumBoardsIds, getBoardsMap],
  (ids, map) => ids.size && [
    { divider: true, disabled: true, dividerName: 'Scrum Boards' },
    ...(ids.toArray().map(id => ({
      value: id,
      divider: false,
      label: map.getIn([`${id}`, 'name']), // converting id to a string
      type: 'scrum',
    }))),
  ],
);
export const getKanbanBoardsOptions = createSelector(
  [getKanbanBoardsIds, getBoardsMap],
  (ids, map) => ids.size && [
    { divider: true, disabled: true, dividerName: 'Kanban Boards' },
    ...(ids.toArray().map(id => ({
      value: id,
      divider: false,
      label: map.getIn([`${id}`, 'name']), // converting id to a string
      type: 'kanban',
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
      label: (type !== 'project' ? boardsMap : projectsMap).getIn([`${id}`, 'name']),
    }) : null);
    return r;
  },
);

export const getSelectedSprintOption = createSelector(
  [getSelectedSprintId, getSprintsMap],
  (id, map1) => (id ? ({
    value: id,
    label: map1.getIn([`${id}`, 'name']),
  }) : null),
);

export const getSprints = createSelector(
  [getSprintsIds, getSprintsMap],
  (ids, map) => ids.map(id => ({
    value: id,
    label: map.getIn([`${id}`, 'name']),
  })).toArray(),
);
