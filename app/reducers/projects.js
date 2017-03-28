import { combineReducers } from 'redux';
import { Record, OrderedSet, fromJS } from 'immutable';

import * as types from '../constants';

function allItems(state = new OrderedSet(), action) {
  switch (action.type) {
    case types.FILL_PROJECTS:
      return new OrderedSet(action.payload.ids);
    case types.CLEAR_ALL_REDUCERS:
      return new OrderedSet();
    default:
      return state;
  }
}

function itemsById(state = new Map(), action) {
  switch (action.type) {
    case types.FILL_PROJECTS:
      return fromJS(action.payload.map);
    case types.CLEAR_ALL_REDUCERS:
      return new Map();
    default:
      return state;
  }
}

const initialMeta = Record({
  fetching: false,
  fetched: false,
  selectedProjectId: null,
});

function meta(state = new initialMeta(), action) {
  switch (action.type) {
    case types.SET_PROJECTS_FETCH_STATE:
      return state.set('fetching', action.payload);
    case types.SET_PROJECTS_FETCHED_STATE:
      return state.set('fetched', action.payload);
    case types.SELECT_PROJECT:
      return state.set('selectedProjectId', action.payload);
    case types.CLEAR_ALL_REDUCERS:
      return new initialMeta();
    default:
      return state;
  }
}

export default combineReducers({
  byId: itemsById,
  allIds: allItems,
  meta,
});
