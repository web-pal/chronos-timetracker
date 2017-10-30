// @flow
import { combineReducers } from 'redux';
import union from 'lodash.union';
import merge from 'lodash.merge';
import { types } from 'actions';

import type { Id, IssuesMap, IssuesMeta, IssueTypesMap, IssueStatusesMap } from '../types';

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
        action.payload.map,
        state,
      );
    case types.ADD_WORKLOG_TO_ISSUE:
      return {
        ...state,
        [action.meta]: {
          ...state[action.meta],
          fields: {
            ...state[action.meta].fields,
            worklog: {
              ...state[action.meta].fields.worklog,
              worklogs: [
                action.payload,
                ...state[action.meta].fields.worklog.worklogs,
              ],
            },
          },
        },
      };
    case types.SET_ISSUE_STATUS:
      return {
        ...state,
        [action.meta.id]: {
          ...state[action.meta.id],
          fields: {
            ...state[action.meta.id].fields,
            status: action.payload,
          },
        },
      };
    case types.SET_ISSUE_ASSIGNEE:
      return {
        ...state,
        [action.meta.id]: {
          ...state[action.meta.id],
          fields: {
            ...state[action.meta.id].fields,
            assignee: action.payload,
          },
        },
      };
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

function foundIds(state: Array<Id> = [], action): Array<Id> {
  switch (action.type) {
    case types.FILL_FOUND_ISSUE_IDS:
      return action.payload;
    case types.ADD_FOUND_ISSUE_IDS:
      return union(
        state,
        action.payload,
      );
    case types.CLEAR_FOUND_ISSUE_IDS:
    case types.CLEAR_ISSUES:
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

function issueTypesIds(state: Array<Id> = [], action): Array<Id> {
  switch (action.type) {
    case types.FILL_ISSUE_TYPES:
      return action.payload.ids;
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

function issueTypesById(state: IssueTypesMap = {}, action) {
  switch (action.type) {
    case types.FILL_ISSUE_TYPES:
      return action.payload.map;
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

function issueStatusesIds(state: Array<Id> = [], action): Array<Id> {
  switch (action.type) {
    case types.FILL_ISSUE_STATUSES:
      return action.payload.ids;
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

function issueStatusesById(state: IssueStatusesMap = {}, action) {
  switch (action.type) {
    case types.FILL_ISSUE_STATUSES:
      return action.payload.map;
    case types.___CLEAR_ALL_REDUCERS___:
      return [];
    default:
      return state;
  }
}

const initialMeta: IssuesMeta = {
  fetching: false,
  recentFetching: false,
  searching: false,
  totalCount: 0,
  lastStopIndex: 0,
  selectedIssueId: null,
  trackingIssueId: null,
  selectedIssue: null,
  trackingIssue: null,
  searchValue: '',
  filters: {
    type: [],
    status: [],
    assignee: [],
  },
  availableTransitions: [],
  availableTransitionsFetching: false,
};

function meta(state: IssuesMeta = initialMeta, action) {
  switch (action.type) {
    case types.FETCH_ISSUES_REQUEST:
      return {
        ...state,
        searching: action.payload.search,
      };
    case types.SET_ISSUES_FETCHING:
      return {
        ...state,
        fetching: action.payload,
      };
    case types.SET_RECENT_ISSUES_FETCHING:
      return {
        ...state,
        recentFetching: action.payload,
      };
    case types.SET_ISSUES_TOTAL_COUNT:
      return {
        ...state,
        totalCount: action.payload,
      };
    case types.SELECT_ISSUE:
      return {
        ...state,
        selectedIssueId: action.payload ? action.payload.id : null,
        selectedIssue: action.payload,
      };
    case types.SET_TRACKING_ISSUE:
      return {
        ...state,
        trackingIssueId: action.payload ? action.payload.id : null,
        trackingIssue: action.payload,
      };
    case types.SET_ISSUES_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.payload,
      };
    case types.SET_ISSUES_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.meta.filterName]: action.payload,
        },
      };
    case types.___CLEAR_ALL_REDUCERS___:
      return initialMeta;
    case types.FILL_AVAILABLE_TRANSITIONS:
      return {
        ...state,
        availableTransitions: action.payload,
      };
    case types.SET_AVAILABLE_TRANSITIONS_FETCHING:
      return {
        ...state,
        availableTransitionsFetching: action.payload,
      };
    default:
      return state;
  }
}

export default combineReducers({
  byId: itemsById,
  allIds: allItems,
  issueTypesIds,
  issueTypesById,
  issueStatusesIds,
  issueStatusesById,
  recentIds,
  foundIds,
  meta,
});
