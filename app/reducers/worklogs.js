// @flow
import { combineReducers } from 'redux';
import union from 'lodash.union';
import merge from 'lodash.merge';
import { types } from 'actions';

import type { Id, WorklogsMap, WorklogsMeta } from '../types';

function allItems(state: Array<Id> = [], action) {
  switch (action.type) {
    case types.FILL_WORKLOGS:
      return action.payload.ids;
    case types.ADD_WORKLOGS:
      return union(
        state,
        action.payload.ids,
      );
    case types.CLEAR_WORKLOGS:
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

function itemsById(state: WorklogsMap = {}, action) {
  switch (action.type) {
    case types.FILL_WORKLOGS:
      return action.payload.map;
    case types.ADD_WORKLOGS:
      return merge(
        state,
        action.payload.map,
      );
    case types.CLEAR_WORKLOGS:
    case types.___CLEAR_ALL_REDUCERS___:
      return {};
    default:
      return state;
  }
}

function recentWorklogIds(state: Array<Id> = [], action) {
  switch (action.type) {
    case types.FILL_RECENT_WORKLOG_IDS:
      return action.payload.ids;
    case types.ADD_RECENT_WORKLOG_IDS:
      return union(
        state,
        action.payload.ids,
      );
    case types.CLEAR_WORKLOGS:
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

const initialMeta: WorklogsMeta = {
  fetching: false,
  editWorklogFetching: false,
  worklogComment: '',
  selectedWorklogId: null,
  temporaryWorklogId: null,
  editingWorklog: null,
};

function meta(state: WorklogsMeta = initialMeta, action) {
  switch (action.type) {
    case types.SET_WORKLOGS_FETCHING:
      return {
        ...state,
        fetching: action.payload,
      };
    case types.SET_ADD_WORKLOG_FETCHING:
      return {
        ...state,
        editWorklogFetching: action.payload,
      };
    case types.SET_WORKLOG_COMMENT:
      return {
        ...state,
        worklogComment: action.payload,
      };
    case types.SELECT_WORKLOG:
      return {
        ...state,
        selectedWorklogId: action.payload,
      };
    case types.SET_TEMPORARY_WORKLOG_ID:
      return {
        ...state,
        temporaryWorklogId: action.payload,
      };
    case types.SET_EDITING_WORKLOG:
      return {
        ...state,
        editingWorklog: action.payload,
      };
    case types.CLEAR_WORKLOGS:
    case types.___CLEAR_ALL_REDUCERS___:
      return initialMeta;
    default:
      return state;
  }
}

export default combineReducers({
  byId: itemsById,
  allIds: allItems,
  recentWorklogIds,
  meta,
});
