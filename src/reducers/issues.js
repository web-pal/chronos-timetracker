import { combineReducers } from 'redux';
import { Map, OrderedSet, fromJS } from 'immutable';

import * as types from '../constants';

function allItems(state = new OrderedSet(), action) {
  switch (action.type) {
    case types.FILL_ISSUES:
      return new OrderedSet(action.payload.ids);
    case types.ADD_ISSUES:
      return state.union(new OrderedSet(action.payload.ids));
    case types.CLEAR_ISSUES:
      return new OrderedSet();
    default:
      return state;
  }
}

function itemsById(state = new Map(), action) {
  switch (action.type) {
    case types.FILL_ISSUES:
      return fromJS(action.payload.map);
    case types.ADD_ISSUES:
      return state.merge(new Map(fromJS(action.payload.map)));
    case types.CLEAR_ISSUES:
      return new Map();
    default:
      return state;
  }
}

function recentItems(state = new Map(), action) {
  switch (action.type) {
    case types.FILL_RECENT_ISSUES:
      return fromJS(action.payload.map) || new Map();
    case types.ADD_RECENT_ISSUE:
      return state.set(action.payload.id, action.payload.issue);
    default:
      return state;
  }
}

const initialMeta = new Map({
  fetching: false,
  total: 0,
  selected: null,
  tracking: null,
  recentSelected: null,
  recent: new OrderedSet(),
  searchResults: new OrderedSet(),
});

function meta(state = initialMeta, action) {
  switch (action.type) {
    case types.SET_ISSUES_FETCH_STATE:
      return state.set('fetching', action.payload);
    case types.GET_ISSUES_COUNT:
      return state.set('total', action.payload);
    case types.SELECT_ISSUE:
      return state.set('selected', action.payload);
    case types.FILL_RECENT_ISSUES:
      return state.set('recent', new OrderedSet(action.payload.ids));
    case types.ADD_RECENT_ISSUE:
      return state.set('recent', state.get('recent').add(action.payload.id));
    case types.FILL_SEARCH_ISSUES:
      return state.set('searchResults', new OrderedSet(action.payload));
    case types.SELECT_RECENT:
      return state.set('recentSelected', action.payload);
    case types.SET_TRACKING_ISSUE:
      return state.set('tracking', action.payload);
    case types.CLEAR_TRACKING_ISSUE:
      return state.set('tracking', null);
    case types.CLEAR_ISSUES:
      return initialMeta;
    default:
      return state;
  }
}

export default combineReducers({
  byId: itemsById,
  allIds: allItems,
  recentById: recentItems,
  meta,
});
