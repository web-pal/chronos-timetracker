// @flow
import * as types from './actionTypes';
import type {
  FetchProjectsRequest, FetchProjectsRequestAction,
  SetProjectsFetching, SetProjectsFetchingAction,
  SelectProject, SelectProjectAction,
  SelectSprint, SelectSprintAction,
  FillProjects, FillProjectsAction,
  FillSprints, FillSprintsAction,
  FillBoards, FillBoardsAction,
  ProjectsMap, BoardsMap, SprintsMap,
} from '../types';

export const fetchProjectsRequest: FetchProjectsRequest =
  (): FetchProjectsRequestAction => ({
    type: types.FETCH_PROJECTS_REQUEST,
  });

export const setProjectsFetching: SetProjectsFetching = (
  payload: boolean,
): SetProjectsFetchingAction => ({
  type: types.SET_PROJECTS_FETCHING,
  payload,
});

export const selectProject: SelectProject = (
  projectId: string,
  type: string,
): SelectProjectAction => ({
  type: types.SELECT_PROJECT,
  payload: projectId,
  meta: type,
});

export const selectSprint: SelectSprint = (
  sprintId: string,
): SelectSprintAction => ({
  type: types.SELECT_SPRINT,
  payload: sprintId,
});

export const fillProjects: FillProjects = (
  payload: { ids: Array<string>, map: ProjectsMap },
): FillProjectsAction => ({
  type: types.FILL_PROJECTS,
  payload,
});

export const fillBoards: FillBoards = (
  payload: { ids: Array<string>, map: BoardsMap },
  kanbanBoards: Array<string>,
  scrumBoards: Array<string>,
): FillBoardsAction => ({
  type: types.FILL_BOARDS,
  payload,
  meta: {
    kanbanBoards,
    scrumBoards,
  },
});

export const fillSprints: FillSprints = (
  payload: { ids: Array<string>, map: SprintsMap },
): FillSprintsAction => ({
  type: types.FILL_SPRINTS,
  payload,
});
