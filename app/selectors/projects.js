// @flow
import {
  createSelector,
} from 'reselect';

import type {
  Id,
  BoardsResources,
  Board,
  SprintsResources,
  Project,
} from 'types';

import {
  getResourceMap,
  getResourceMappedList,
} from './resources';
import {
  getUiState,
} from './ui';


export const getCurrentProjectId = createSelector(
  [
    getUiState('issuesSourceId'),
    getUiState('issuesSourceType'),
    getUiState('issuesSprintId'),
    getResourceMap('boards'),
    getResourceMap('sprints'),
  ],
  (
    issuesSourceId: Id,
    issuesSourceType: string,
    issuesSprintId: Id,
    boardsMap: BoardsResources,
    sprintsMap: SprintsResources,
  ) => {
    let projectId = issuesSourceId;
    if (issuesSourceId && issuesSourceType === 'kanban') {
      const board = boardsMap[issuesSourceId];
      if (board) {
        projectId = board.location ? board.location.projectId : null; // eslint-disable-line
      }
    }
    if (issuesSprintId && issuesSourceType === 'scrum') {
      const sprint = sprintsMap[issuesSprintId];
      if (sprint) {
        const board = boardsMap[sprint.originBoardId];
        if (board) {
          projectId = board.location ? board.location.projectId : null; // eslint-disable-line
        }
      }
    }
    return projectId;
  },
);

export const getCurrentProjectKey = createSelector(
  [
    getCurrentProjectId,
    getResourceMap('projects'),
  ],
  (
    projectId,
    projects,
  ) => (projects[projectId] ? projects[projectId].key : ''),
);

export const getProjectsOptions = createSelector(
  [
    getResourceMappedList('projects', 'allProjects'),
    getResourceMappedList('boards', 'allBoards'),
  ],
  (
    projects: Array<Project>,
    boards: Array<Board>,
  ) => [
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
