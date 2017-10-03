// @flow
import { combineReducers } from 'redux';
import union from 'lodash.union';
import merge from 'lodash.merge';
import { types } from 'actions';

import type { Id, IssuesMap, IssuesMeta } from '../types';

function allItems(state: Array<Id> = [], action): Array<Id> {
  switch (action.type) {
    case types.FILL_ISSUES:
      return action.payload.ids;
    case types.ADD_ISSUES:
      return union(
        state,
        action.payload.ids,
      );
    case types.CLEAR_ISSUES:
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

function itemsById(state: IssuesMap = {}, action): IssuesMap {
  switch (action.type) {
    case types.FILL_ISSUES:
      return action.payload.map;
    case types.ADD_ISSUES:
      return merge(
        state,
        action.payload.map,
      );
    case types.CLEAR_ISSUES:
    case types.___CLEAR_ALL_REDUCERS___:
      return {};
    default:
      return state;
  }
}

function recentIds(state: Array<Id> = [], action): Array<Id> {
  switch (action.type) {
    case types.FILL_RECENT_ISSUE_IDS:
      return action.payload;
    case types.CLEAR_ISSUES:
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

const initialMeta: IssuesMeta = {
  fetching: false,
  totalCount: 0,
  lastStopIndex: 0,
  selectedIssueId: null,
  trackingIssueId: null,
  searchValue: '',
  screenshots: [],
};

function meta(state: IssuesMeta = initialMeta, action) {
  switch (action.type) {
    case types.SET_ISSUES_FETCHING:
      return {
        ...state,
        fetching: action.payload,
      };
    case types.SET_ISSUES_TOTAL_COUNT:
      return {
        ...state,
        totalCount: action.payload,
      };
    case types.SET_LAST_STOP_INDEX:
      return {
        ...state,
        lastStopIndex: action.payload,
      };
    case types.SELECT_ISSUE:
      return {
        ...state,
        selectedIssueId: action.payload,
      };
    case types.SET_TRACKING_ISSUE:
      return {
        ...state,
        trackingIssueId: action.payload,
      };
    case types.SET_ISSUES_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.payload,
      };
    case types.DELETE_SCREENSHOT: {
      const newScreenshots = [...state.screenshots];
      return {
        ...state,
        screenshots: newScreenshots.splice(action.payload, 1),
      };
    }
    case types.ADD_SCREENSHOT:
      return {
        ...state,
        screenshots: [
          ...state.screenshots,
          action.payload,
        ],
      };
    case types.CLEAR_SCREENSHOTS:
      return {
        ...state,
        screenshots: [],
      };
    case types.___CLEAR_ALL_REDUCERS___:
      return initialMeta;
    default:
      return state;
  }
}

export default combineReducers({
  byId: itemsById,
  allIds: allItems,
  recentIds,
  meta,
});
