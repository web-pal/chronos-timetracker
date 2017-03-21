import { combineReducers } from 'redux';
import { Map, OrderedSet, fromJS } from 'immutable';

import * as types from '../constants';

function allItems(state = new OrderedSet(), action) {
  switch (action.type) {
    case types.FILL_WORKLOGS:
    case types.FILL_RECENT_WORKLOGS:
      return state.concat(action.payload.ids);
    case types.CLEAR_WORKLOGS:
      return new OrderedSet();
    default:
      return state;
  }
}

function itemsById(state = new Map(), action) {
  switch (action.type) {
    case types.FILL_WORKLOGS:
    case types.FILL_RECENT_WORKLOGS:
      return state.merge(fromJS(action.payload.map));
    case types.CLEAR_WORKLOGS:
      return new Map();
    default:
      return state;
  }
}

const initialMeta = Immutable.Record({
  fetching: false,
  selectedWorklogId: null,
  recent: new OrderedSet(),
});

function meta(state = new initialMeta(), action) {
  switch (action.type) {
    case types.SET_WORKLOGS_FETCH_STATE:
      return state.set('fetching', action.payload);
    case types.SELECT_WORKLOG:
      return state.set('selectedWorklogId', action.payload);
    case types.FILL_RECENT_WORKLOGS:
      return state.set('recent', new OrderedSet(action.payload.ids));
    case types.ADD_RECENT_WORKLOGS:
      return state.set('recent', state.get('recent').union(new OrderedSet(action.payload)));
    case types.ADD_RECENT_WORKLOG:
      return state.set('recent', state.get('recent').add(action.payload.id));
    case types.CLEAR_WORKLOGS:
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
