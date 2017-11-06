// @flow
import { types } from 'actions';
import type { Id } from './index';

export type ProjectType = 'scrum' | 'kanban' | 'project' | 'simple';

export type Project = {
  avatarUrls: {
    '16x16': string,
    '24x24': string,
    '32x32': string,
    '48x48': string,
  },
  expand?: string,
  id: string,
  key: string,
  name: string,
  projectTypeKey?: string,
  self: string,
};

export type Board = {
  id: number,
  name: string,
  self: string,
  type: ProjectType,
};

// TODO type for sprint
export type Sprint = any;

export type ProjectsIds = Array<Id>;
export type BoardsIds = Array<Id>;
export type SprintsIds = Array<Id>;

export type ProjectsMap = { [Id]: Project };
export type BoardsMap = { [Id]: Board };
export type SprintsMap = { [Id]: Sprint };

export type ProjectsMeta = {
  +fetching: boolean,
  +sprintsFetching: boolean,
  +selectedProjectId: Id | null,
  +selectedProjectType: ProjectType | null,
  +selectedSprintId: Id | null,
};

export type ProjectsState = {
  byId: ProjectsMap,
  allIds: Array<Id>,

  boardsById: BoardsMap,
  allBoards: Array<Id>,

  sprintsById: SprintsMap,
  allSprints: Array<Id>,

  allScrumBoards: Array<Id>,
  allKanbanBoards: Array<Id>,

  meta: ProjectsMeta,
}

//
export type FetchProjectsRequestAction =
  {| type: typeof types.FETCH_PROJECTS_REQUEST |};

export type FetchProjectsRequest = {
  (): FetchProjectsRequestAction
};

//
export type SetProjectsFetchingAction =
  {| type: typeof types.SET_PROJECTS_FETCHING, +payload: boolean |};

export type SetProjectsFetching = {
  (payload: boolean): SetProjectsFetchingAction
};

//
export type SelectProjectAction =
  {| type: typeof types.SELECT_PROJECT, payload: string, meta: string |};

export type SelectProject = {
  (projectId: Id, type: ProjectType): SelectProjectAction
};

//
export type SelectSprintAction =
  {| type: typeof types.SELECT_SPRINT, payload: string |};

export type SelectSprint = {
  (sprintId: Id): SelectSprintAction
};

//
export type FillProjectsAction =
  {| type: typeof types.FILL_PROJECTS, payload: { map: ProjectsMap, ids: ProjectsIds } |};

export type FillProjects = {
  (payload: { map: ProjectsMap, ids: ProjectsIds }): FillProjectsAction
};

//
export type FillBoardsAction =
  {|
    type: typeof types.FILL_BOARDS,
    payload: {
      map: BoardsMap,
      ids: BoardsIds
    },
    meta: {
      kanbanBoards: Array<Id>,
      scrumBoards: Array<Id>
    }
  |};

export type FillBoards = {
  (
    payload: {
      map: BoardsMap,
      ids: BoardsIds
    },
    kanbanBoards: Array<Id>,
    scrumBoards: Array<Id>
  ): FillBoardsAction
};

//
export type FillSprintsAction =
  {| type: typeof types.FILL_SPRINTS, payload: { map: SprintsMap, ids: SprintsIds } |};

export type FillSprints = {
  (payload: { map: SprintsMap, ids: SprintsIds }): FillSprintsAction
};

export type ProjectsAction =
  FetchProjectsRequestAction
  | SetProjectsFetchingAction
  | SelectProjectAction
  | SelectSprintAction
  | FillProjectsAction
  | FillBoardsAction
  | FillSprintsAction;
