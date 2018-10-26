import {
  combineReducers,
} from 'redux';

import {
  actionTypes,
} from '../actions';


function byId(
  state = {},
  action,
) {
  switch (action.type) {
    case actionTypes.SET_WINDOWS_STATE:
      return {
        ...(action.meta.merge ? state : {}),
        ...action.payload.byId,
      };
    case actionTypes.ADD_WINDOW:
      return {
        ...state,
        [action.payload.id]: {
          eventLogs: [],
        },
      };
    case actionTypes.ADD_WINDOW_EVENT:
      return (state[action.payload.id])
        ? {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            eventLogs: [
              ...[action.payload.log],
              ...state[action.payload.id].eventLogs,
            ],
          },
        }
        : state;
    case actionTypes.REMOVE_WINDOW: {
      const {
        [action.payload.id]: removedObj,
        ...restState
      } = state;
      return restState;
    }
    case actionTypes.__CLEAR_ALL_REDUCERS__:
      return {};
    default:
      return state;
  }
}

function allIds(
  state = [],
  action,
) {
  switch (action.type) {
    case actionTypes.SET_WINDOWS_STATE:
      return [
        ...(action.meta.merge ? state : []),
        ...action.payload.allIds,
      ];
    case actionTypes.ADD_WINDOW:
      return [
        ...state,
        action.payload.id,
      ];
    case actionTypes.REMOVE_WINDOW:
      return state.filter(id => id !== action.payload.id);
    case actionTypes.__CLEAR_ALL_REDUCERS__:
      return [];
    default:
      return state;
  }
}

function scopes(
  state = {},
  action,
) {
  switch (action.type) {
    case actionTypes.SET_WINDOWS_STATE:
      return {
        ...(action.meta.merge ? state : {}),
        ...action.payload.scopes,
      };
    case actionTypes.ADD_WINDOW:
      return {
        ...state,
        ...(action.payload.scopes.reduce((acc, scope) => ({
          ...acc,
          [scope]: [
            ...(state[scope] ? state[scope] : []),
            action.payload.id,
          ],
        }), {})),
      };
    case actionTypes.REMOVE_WINDOW:
      return Object.keys(state).reduce((acc, scope) => ({
        ...acc,
        [scope]: state[scope].filter(id => id !== action.payload.id),
      }), {});
    case actionTypes.__CLEAR_ALL_REDUCERS__:
      return {};
    default:
      return state;
  }
}

function willQuitApp(state = false, action) {
  switch (action.type) {
    case actionTypes.SET_WILL_QUIT_STATE:
      return action.payload;
    case actionTypes.__CLEAR_ALL_REDUCERS__:
      return false;
    default:
      return state;
  }
}

export default combineReducers({
  byId,
  allIds,
  scopes,
  willQuitApp,
});
