import { combineReducers } from 'redux';
import { Map, OrderedSet, fromJS } from 'immutable';

import * as types from '../constants';

function allItems(state = new OrderedSet(), action) {
  switch (action.type) {
    case types.FILL_PROJECTS:
      return new OrderedSet(action.payload.ids);
    case types.CLEAR_PROJECTS:
      return new OrderedSet();
    default:
      return state;
  }
}

function itemsById(state = new Map(), action) {
  switch (action.type) {
    case types.FILL_PROJECTS:
      return fromJS(action.payload.map);
    case types.CLEAR_PROJECTS:
      return new Map();
    default:
      return state;
  }
}

const initialMeta = new Map({
  fetching: false,
  selected: null,
});

function meta(state = initialMeta, action) {
  switch (action.type) {
    case types.SET_PROJECTS_FETCH_STATE:
      return state.set('fetching', action.payload);
    case types.SELECT_PROJECT:
      return state.set('selected', action.payload);
    case types.CLEAR_PROJECTS:
      return initialMeta;
    default:
      return state;
  }
}

export default combineReducers({
  byId: itemsById,
  allIds: allItems,
  meta,
});
