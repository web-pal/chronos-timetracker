// @flow
import { combineReducers } from 'redux';

import { types } from 'actions';

import type {
  ProjectsMap,
  BoardsMap,
  ProjectsMeta,
  SprintsMap,
} from '../types';

//
function allItems(state: Array<string> = [], action) {
  switch (action.type) {
    case types.FILL_PROJECTS:
      return action.payload.ids;
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

function itemsById(state: ProjectsMap = {}, action) {
  switch (action.type) {
    case types.FILL_PROJECTS:
      return action.payload.map;
    case types.___CLEAR_ALL_REDUCERS___:
      return {};
    default:
      return state;
  }
}

//
function allBoards(state: Array<string> = [], action) {
  switch (action.type) {
    case types.FILL_BOARDS:
      return action.payload.ids;
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

function boardsById(state: BoardsMap = {}, action) {
  switch (action.type) {
    case types.FILL_BOARDS:
      return action.payload.map;
    case types.___CLEAR_ALL_REDUCERS___:
      return {};
    default:
      return state;
  }
}

//
function allSprints(state: Array<string> = [], action) {
  switch (action.type) {
    case types.FILL_SPRINTS:
      return action.payload.ids;
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

function sprintsById(state: SprintsMap = {}, action) {
  switch (action.type) {
    case types.FILL_SPRINTS:
      return action.payload.map;
    case types.___CLEAR_ALL_REDUCERS___:
      return {};
    default:
      return state;
  }
}

function allScrumBoards(state: Array<string> = [], action) {
  switch (action.type) {
    case types.FILL_BOARDS:
      return action.meta.scrumBoards;
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

function allKanbanBoards(state: Array<string> = [], action) {
  switch (action.type) {
    case types.FILL_BOARDS:
      return action.meta.kanbanBoards;
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

//
const initialMeta: ProjectsMeta = {
  fetching: false,
  sprintsFetching: false,
  selectedProjectId: null,
  selectedProjectType: null,
  selectedSprintId: null,
};

function meta(state: ProjectsMeta = initialMeta, action) {
  switch (action.type) {
    case types.SET_PROJECTS_FETCHING:
      return {
        ...state,
        fetching: action.payload,
      };
    /* TODO case types.SET_SPRINTS_FOR_BOARD_FETCH_STATE:
      return {
        ...state,
        sprintsFetching: action.payload,
      }; */
    case types.SELECT_SPRINT:
      return {
        ...state,
        selectedSprintId: action.payload,
      };
    case types.SELECT_PROJECT:
      return {
        ...state,
        selectedProjectId: action.payload,
        selectedProjectType: action.meta,
        selectedSprintId: '',
      };
    case types.___CLEAR_ALL_REDUCERS___:
      return initialMeta;
    default:
      return state;
  }
}

export default combineReducers({
  allIds: allItems,
  byId: itemsById,

  allBoards,
  boardsById,

  allSprints,
  sprintsById,

  allScrumBoards,
  allKanbanBoards,

  meta,
});
