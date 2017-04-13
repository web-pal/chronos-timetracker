import { combineReducers } from 'redux';
import { Map, List, OrderedSet, Set, fromJS } from 'immutable';

import * as types from '../constants';

function allItems(state = new OrderedSet(), action) {
  switch (action.type) {
    case types.FILL_ISSUES:
      return state.concat(action.payload.ids);
    case types.CLEAR_ISSUES:
    case types.CLEAR_ALL_REDUCERS:
    case types.DELETE_ISSUES_CRITERIA_FILTER:
    case types.SET_ISSUES_CRITERIA_FILTER:
      return new OrderedSet();
    default:
      return state;
  }
}

function itemsById(state = new Map(), action) {
  switch (action.type) {
    case types.FILL_SEARCH_ISSUES:
    case types.FILL_RECENT_ISSUES:
    case types.FILL_ISSUES:
      return state.merge(fromJS(action.payload.map));
    case types.CLEAR_ISSUES:
    case types.CLEAR_ALL_REDUCERS:
      return new Map();
    default:
      return state;
  }
}

const InitialMeta = Immutable.Record({
  fetching: false,
  fetched: false,

  searchFetching: false,
  recentFetching: false,

  totalCount: 0,
  lastStopIndex: 0,

  selectedIssueId: null,
  selectedIssueIndex: null,
  trackingIssueId: null,

  searchValue: '',
  filterCriteriaPanel: true,

  showFilterCriteriaType: false,
  showFilterCriteriaStatus: false,
  showFilterCriteriaAssignee: false,

  issuesCriteriaOptionsType: new Map(),
  issuesTypesIds: new List(),
  subIssuesTypesIds: new List(),
  issueFilterOfFiltersType: '',
  issueCurrentCriteriaFilterType: new Set(),

  issuesCriteriaOptionsStatus: new Map(),
  issueStatusCategories: new List(),
  issueStatusesIds: new List(),
  issueFilterOfFiltersStatus: '',
  issueCurrentCriteriaFilterStatus: new Set(),

  issueAssigneeIds: fromJS(['none', 'currentUser']),
  issueCurrentCriteriaFilterAssignee: new Set(),

  recentIssuesIds: new OrderedSet(),
  searchResultsIds: new OrderedSet(),
});

function meta(state = new InitialMeta(), action) {
  switch (action.type) {

    case types.SET_ISSUES_FETCH_STATE:
      return state.set('fetching', action.payload);
    case types.SET_ISSUES_FETCHED_STATE:
      return state.set('fetched', action.payload);

    case types.SET_SEARCH_ISSUES_FETCH_STATE:
      return state.set('searchFetching', action.payload);
    case types.SET_RECENT_ISSUES_FETCH_STATE:
      return state.set('recentFetching', action.payload);

    case types.SET_ISSUES_COUNT:
      return state.set('totalCount', action.payload);
    case types.SET_LAST_STOP_INDEX:
      return state.set('lastStopIndex', action.payload);

    case types.SET_ISSUES_SEARCH_VALUE:
      return state.set('searchValue', action.payload)
        .set('filterCriteriaPanel', !action.payload);

    case types.SET_SHOWING_FILTER_CRITERIA_BLOCK:
      return state.set(`showFilterCriteria${action.meta}`, action.payload);

    case types.SET_FILTER_OF_ISSUES_CRITERIA_FILTERS:
      return state.set(`issueFilterOfFilters${action.meta.filterName}`, action.payload.value);

    case types.SET_SAVED_ISSUES_CRITERIA_FILTER: {
      const { type, status, assignee } = action.payload;
      return state
        .set('issueCurrentCriteriaFilterType', new Set(type))
        .set('issueCurrentCriteriaFilterStatus', new Set(status))
        .set('issueCurrentCriteriaFilterAssignee', new Set(assignee));
    }

    case types.SET_ISSUES_CRITERIA_FILTER: {
      const stateField = `issueCurrentCriteriaFilter${action.meta.criteriaName}`;
      const stateOptionsField = `issuesCriteriaOptions${action.meta.criteriaName}`;
      const filters = state.get(stateField);
      const criteriasMap = state.get(stateOptionsField);
      const newState = action.meta.criteriaName !== 'Assignee'
        ? state.set(
          stateOptionsField,
          criteriasMap.set(
            action.payload.value,
            criteriasMap.get(action.payload.value).set('checked', true),
          ),
        )
        : state;
      return newState.set(
        stateField,
        filters.add(action.payload.value),
      ).set('lastStopIndex', 0);
    }

    case types.DELETE_ISSUES_CRITERIA_FILTER: {
      const stateField = `issueCurrentCriteriaFilter${action.meta.criteriaName}`;
      const stateOptionsField = `issuesCriteriaOptions${action.meta.criteriaName}`;
      const filters = state.get(stateField);
      const criteriasMap = state.get(stateOptionsField);
      const newState = action.meta.criteriaName !== 'Assignee'
        ? state.set(
          stateOptionsField,
          criteriasMap.set(
            action.payload.value,
            criteriasMap.get(action.payload.value).set('checked', false),
          ),
        )
        : state;
      return newState.set(
        stateField,
        filters.delete(action.payload.value),
      ).set('lastStopIndex', 0).set(
        'totalCount',
        state.get('totalCount') || 10,
      );
    }

    case types.FILL_ISSUES_ALL_TYPES:
      return state.set('issuesCriteriaOptionsType', fromJS(action.payload.map))
                  .set('issuesTypesIds', fromJS(action.payload.issuesIds))
                  .set('subIssuesTypesIds', fromJS(action.payload.subIssuesIds));

    case types.FILL_ISSUES_ALL_STATUSES:
      return state.set('issuesCriteriaOptionsStatus', fromJS(action.payload.map))
                  .set('issueStatusCategories', fromJS(action.payload.statusCategories))
                  .set('issueStatusesIds', fromJS(action.payload.ids));

    case types.SELECT_ISSUE:
      return state.set('selectedIssueId', action.payload);
    case types.SET_SELECTED_INDEX:
      return state.set('selectedIssueIndex', action.payload);
    case types.SET_TRACKING_ISSUE:
      return state.set('trackingIssueId', action.payload);

    case types.FILL_RECENT_ISSUES:
      return state.set('recentIssuesIds', new OrderedSet(action.payload.ids));
    case types.FILL_SEARCH_ISSUES:
      return state.set('searchResultsIds', new OrderedSet(action.payload.ids));
    case types.CLEAR_ISSUES_SEARCH_RESULTS:
      return state.set('searchResults', new OrderedSet());

    case types.CLEAR_ALL_REDUCERS:
    case types.CLEAR_ISSUES:
      return new InitialMeta();
    default:
      return state;
  }
}

export default combineReducers({
  byId: itemsById,
  allIds: allItems,
  meta,
});
