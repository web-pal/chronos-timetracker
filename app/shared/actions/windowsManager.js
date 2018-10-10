import {
  actionTypes,
} from '.';


export const setWindowsState = ({
  byId = {},
  allIds = [],
  scopes = {},
  merge = false,
  scope = [],
}) => ({
  type: actionTypes.SET_WINDOWS_STATE,
  payload: {
    byId,
    allIds,
    scopes,
  },
  meta: {
    merge,
  },
  scope,
});

export const addWindow = ({
  id,
  scopes = [],
  scope = [],
}) => ({
  type: actionTypes.ADD_WINDOW,
  payload: {
    id,
    scopes,
  },
  scope,
});

export const removeWindow = ({
  id,
  scope = [],
}) => ({
  type: actionTypes.REMOVE_WINDOW,
  payload: {
    id,
  },
  scope,
});

export const addWindowEvent = ({
  id,
  log,
  scope = [],
}) => ({
  type: actionTypes.ADD_WINDOW_EVENT,
  payload: {
    id,
    log,
  },
  scope,
});
