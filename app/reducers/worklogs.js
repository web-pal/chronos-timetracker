import { combineReducers } from 'redux';
import { Map, OrderedSet, List, fromJS } from 'immutable';

import * as types from '../constants';

function allItems(state = new OrderedSet(), action) {
  switch (action.type) {
    case types.FILL_WORKLOGS:
    case types.FILL_RECENT_WORKLOGS:
    case types.MERGE_RECENT_WORKLOGS:
      return state.concat(action.payload.ids);
    case types.ADD_RECENT_WORKLOG:
      return state.add(action.payload.id);
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
    case types.MERGE_RECENT_WORKLOGS:
      return state.merge(fromJS(action.payload.map));
    case types.ADD_RECENT_WORKLOG:
      return state.set(action.payload.id, fromJS(action.payload));
    case types.CLEAR_WORKLOGS:
    case types.CLEAR_ALL_REDUCERS:
      return new Map();
    default:
      return state;
  }
}

const InitialMeta = Immutable.Record({
  showWorklogTypes: false,
  fetching: false,
  worklogUploading: false,
  screenshotUploading: false,
  checkOfflineScreenshots: false,
  checkOfflineWorklogs: false,
  selectedWorklogId: null,
  temporaryWorklogId: null,
  recentWorkLogsIds: new OrderedSet(),
  currentWorklogScreenshots: new List(),
  currentDescription: '',
  worklogTypes: new List(),
  currentWorklogType: '',
});

function meta(state = new InitialMeta(), action) {
  switch (action.type) {
    case types.DELETE_SCREENSHOT_FROM_WORKLOG:
      return state
        .set(
          'currentWorklogScreenshots',
          state.currentWorklogScreenshots.set(action.meta.index, action.payload),
        );
    case types.SET_WORKLOGS_FETCH_STATE:
      return state.set('fetching', action.payload);
    case types.SET_WORKLOG_UPLOAD_STATE:
      return state.set('worklogUploading', action.payload);
    case types.SET_SCREENSHOT_UPLOAD_STATE:
      return state.set('screenshotUploading', action.payload);
    case types.SET_CURRENT_DESCRIPTION:
      return state.set('currentDescription', action.payload);
    case types.SET_STATE_CHECK_OFFLINE_SCREENSHOTS:
      return state.set('checkOfflineScreenshots', action.payload);
    case types.SET_STATE_CHECK_OFFLINE_WORKLOGS:
      return state.set('checkOfflineWorklogs', action.payload);
    case types.SET_TEMPORARY_ID:
      return state.set('temporaryWorklogId', action.payload);
    case types.SELECT_WORKLOG:
      return state.set('selectedWorklogId', action.payload);
    case types.SELECT_WORKLOG_TYPE:
      return state.set('currentWorklogType', action.payload);
    case types.FILL_RECENT_WORKLOGS:
      return state.set('recentWorkLogsIds', new OrderedSet(action.payload.ids));
    case types.MERGE_RECENT_WORKLOGS:
      return state.update('recentWorkLogsIds', worklogs => worklogs.concat(action.payload.ids));
    case types.ADD_RECENT_WORKLOG:
      return state.set('recentWorkLogsIds', state.recentWorkLogsIds.add(action.payload.id));
    case types.ADD_SCREENSHOT_TO_CURRENT_LIST:
      return state.update(
        'currentWorklogScreenshots',
        list => list.push(action.payload),
      );
    case types.FILL_WORKLOG_TYPES:
      return state
        .set('showWorklogTypes', action.payload.enabled)
        .set('worklogTypes', fromJS(action.payload.types));
    case types.CLEAR_CURRENT_SCREENSHOTS_LIST:
      return state.set('currentWorklogScreenshots', Immutable.List());
    case types.CLEAR_WORKLOGS:
    case types.CLEAR_ALL_REDUCERS:
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
