// @flow
import { createSelector } from 'reselect';
import type { ProjectsState, ProjectsMap, SprintsMap, BoardsMap, Id } from '../types';

export const getProjectsIds =
  ({ projects } : { projects: ProjectsState }): Array<Id> => projects.allIds;

export const getProjectsMap =
  ({ projects } : { projects: ProjectsState }): ProjectsMap => projects.byId;

export const getSprintsIds =
  ({ projects } : { projects: ProjectsState }): Array<Id> => projects.allSprints;

export const getSprintsMap =
  ({ projects } : { projects: ProjectsState }): SprintsMap => projects.sprintsById;

export const getBoardsIds =
  ({ projects } : { projects: ProjectsState }): Array<Id> => projects.allBoards;

export const getBoardsMap =
  ({ projects } : { projects: ProjectsState }): BoardsMap => projects.boardsById;

export const getProjects = createSelector(
  [getProjectsIds, getProjectsMap],
  (ids, map) => {
    const projects = [];
    ids.forEach(id => projects.push(map[id]));
    return projects;
  },
);

export const getSprints = createSelector(
  [getSprintsIds, getSprintsMap],
  (ids, map) => {
    const sprints = [];
    ids.forEach(id => sprints.push(map[id]));
    return sprints;
  },
);

export const getBoards = createSelector(
  [getBoardsIds, getBoardsMap],
  (ids, map) => {
    const boards = [];
    ids.forEach(id => boards.push(map[id]));
    return boards;
  },
);

export const getProjectsFetching =
  ({ projects } : { projects: ProjectsState }): boolean => projects.meta.fetching;

export const getSprintsFetching =
  ({ projects } : { projects: ProjectsState }): boolean => projects.meta.sprintsFetching;

export const getSelectedBoardId =
  ({ projects } : { projects: ProjectsState }): Id | null =>
    (projects.meta.selectedProjectType !== 'project' ? projects.meta.selectedProjectId : null);

export const getSelectedProjectId =
  ({ projects } : { projects: ProjectsState }): Id | null => projects.meta.selectedProjectId;

export const getSelectedProjectType =
  ({ projects } : { projects: ProjectsState }): Id | null => projects.meta.selectedProjectType;

export const getSelectedSprintId =
  ({ projects } : { projects: ProjectsState }): Id | null => projects.meta.selectedSprintId;

export const getSelectedProject = createSelector(
  [getSelectedProjectId, getProjectsMap],
  (id, map) => (id ? map[id] : null) || null,
);

export const getSelectedBoard = createSelector(
  [getSelectedBoardId, getBoardsMap],
  (id, map) => (id ? map[id] : null) || null,
);

export const getSelectedProjectOption = createSelector(
  [getSelectedProject, getSelectedBoard],
  (project, board) => {
    if (project) {
      return ({
        value: project.id,
        content: project.name,
        meta: {
          project,
        },
      });
    }
    if (board) {
      return ({
        value: board.id,
        content: board.name,
        meta: {
          board,
        },
      });
    }
    return null;
  },
);

export const getCurrentProjectId = createSelector(
  [getSelectedProjectOption, getSelectedProjectType],
  (option, projectType) => {
    if (!option) {
      return null;
    }
    if (projectType === 'project') {
      return option.value;
    }
    return option.meta.board.location.projectId.toString();
  },
);

export const getSelectedSprint = createSelector(
  [getSelectedSprintId, getSprintsMap],
  (id, map) => (id ? map[id] : null),
);

export const getSelectedSprintOption = createSelector(
  [getSelectedSprint],
  sprint => (
    sprint ? ({ value: sprint.id, content: sprint.name, meta: { sprint } }) : null
  ),
);

export const getProjectsOptions = createSelector(
  [getProjects, getBoards],
  (projects, boards) => [
    {
      heading: 'Projects',
      items: projects.map(project =>
        ({ value: project.id, content: project.name, meta: { project } })),
    },
    {
      heading: 'Boards',
      items: boards.map(board =>
        ({ value: board.id, content: board.name, meta: { board } })),
    },
  ],
);

export const getSprintsOptions = createSelector(
  [getSprints],
  sprints => [{
    heading: 'Sprints',
    items: sprints.map(sprint =>
      ({ value: sprint.id, content: sprint.name, meta: { sprint } })),
  }],
);
