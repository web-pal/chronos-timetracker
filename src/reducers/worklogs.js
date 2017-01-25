import { combineReducers } from 'redux';
import { Map, OrderedSet, fromJS } from 'immutable';

import * as types from '../constants';

function allItems(state = new OrderedSet(), action) {
  switch (action.type) {
    case types.FILL_WORKLOGS:
      return new OrderedSet(action.payload.ids);
    case types.ADD_WORKLOGS:
      return state.union(action.payload.ids);
    case types.ADD_RECENT_WORKLOG:
      return state.add(action.payload.id);
    case types.CLEAR_WORKLOGS:
      return new OrderedSet();
    default:
      return state;
  }
}

function itemsById(state = new Map(), action) {
  switch (action.type) {
    case types.FILL_WORKLOGS:
      return fromJS(action.payload.map);
    case types.ADD_WORKLOGS:
      return state.concat(fromJS(action.payload.map));
    case types.ADD_RECENT_WORKLOG:
      return state.set(action.payload.id, fromJS(action.payload));
    case types.CLEAR_WORKLOGS:
      return new Map();
    default:
      return state;
  }
}

function meta(state = new Map({
  fetching: false,
  recent: new OrderedSet(),
}), action) {
  switch (action.type) {
    case types.SET_WORKLOGS_FETCH_STATE:
      return state.set('fetching', action.payload);
    case types.FILL_RECENT_WORKLOGS:
      return state.set('recent', new OrderedSet(action.payload));
    case types.ADD_RECENT_WORKLOG:
      return state.set('recent', state.get('recent').add(action.payload.id));
    default:
      return state;
  }
}

export default combineReducers({
  byId: itemsById,
  allIds: allItems,
  meta,
});
