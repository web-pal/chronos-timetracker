import { combineReducers } from 'redux';
import { Map, OrderedSet, List, fromJS } from 'immutable';

import * as types from '../constants';

function allItems(state = new OrderedSet(), action) {
  switch (action.type) {
    case types.FILL_WORKLOGS:
    case types.FILL_RECENT_WORKLOGS:
      return state.concat(action.payload.ids);
    case types.CLEAR_WORKLOGS:
    case types.CLEAR_ALL_REDUCERS:
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
    case types.CLEAR_ALL_REDUCERS:
      return new Map();
    default:
      return state;
  }
}

const initialMeta = Immutable.Record({
  fetching: false,
  selectedWorklogId: null,
  recentWorkLogsIds: new OrderedSet(),
  currentWorklogScreenshots: new List(),
});

function meta(state = new initialMeta(), action) {
  switch (action.type) {
    case types.SET_WORKLOGS_FETCH_STATE:
      return state.set('fetching', action.payload);
    case types.SELECT_WORKLOG:
      return state.set('selectedWorklogId', action.payload);
    case types.FILL_RECENT_WORKLOGS:
      return state.set('recentWorkLogsIds', new OrderedSet(action.payload.ids));
    case types.CLEAR_WORKLOGS:
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
