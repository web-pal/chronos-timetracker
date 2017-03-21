import { combineReducers } from 'redux';
import { Map, OrderedSet, fromJS } from 'immutable';

import * as types from '../constants';

function allItems(state = new OrderedSet(), action) {
  switch (action.type) {
    case types.FILL_ISSUES:
      return state.concat(action.payload.ids);
    case types.CLEAR_ISSUES:
    case types.CLEAR_ALL_REDUCERS:
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
      return state.set('searchValue', action.payload);

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
