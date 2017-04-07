import { combineReducers } from 'redux';
import { Map, List, OrderedSet, fromJS } from 'immutable';

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
  issueCurrentCriteriaFilterType: new List(),

  issuesCriteriaOptionsStatus: new Map(),
  issueStatusCategories: new List(),
  issueStatusesIds: new List(),
  issueFilterOfFiltersStatus: '',
  issueCurrentCriteriaFilterStatus: new List(),

  issuesCriteriaOptionsAssignee: fromJS({
    none: { name: 'Unassigned', id: 'none', field: 'assignee is EMPTY', checked: false },
    currentUser: { name: 'Current User', id: 'currentUser', field: 'assignee = currentUser()', checked: false },
  }),
  issueAssigneeIds: fromJS(['none', 'currentUser']),
  issueFilterOfFiltersAssignee: '',
  issueCurrentCriteriaFilterAssignee: new List(),

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

    case types.SET_ISSUES_CRITERIA_FILTER: {
      const stateField = `issueCurrentCriteriaFilter${action.meta.criteriaName}`;
      const stateOptionsField = `issuesCriteriaOptions${action.meta.criteriaName}`;
      const filters = state.get(stateField);
      const criteriasMap = state.get(stateOptionsField);
      return state.set(
        stateField,
        filters.push(action.payload.value),
      ).set(stateOptionsField, criteriasMap.set(
        action.payload.value,
        criteriasMap.get(action.payload.value).set('checked', true),
      ),
    ).set('lastStopIndex', 0);
    }

    case types.DELETE_ISSUES_CRITERIA_FILTER: {
      const stateField = `issueCurrentCriteriaFilter${action.meta.criteriaName}`;
      const stateOptionsField = `issuesCriteriaOptions${action.meta.criteriaName}`;
      const filters = state.get(stateField).filter(id => id !== action.payload.value);
      const criteriasMap = state.get(stateOptionsField);
      return state.set(
        stateField,
        filters,
      ).set(stateOptionsField, criteriasMap.set(
        action.payload.value,
        criteriasMap.get(action.payload.value).set('checked', false),
      ),
    ).set('lastStopIndex', 0);
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
