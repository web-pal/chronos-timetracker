import storage from 'electron-json-storage';

import * as types from '../constants/jira';

const InitialState = Immutable.Record({
  self: Immutable.Map({}),
  client: null,
  error: null,
  connected: false,
  credentials: Immutable.Map({}),
  jwt: null,
  fetching: false,
  online: false,
  installUpdate: false,
});

const initialState = new InitialState();

function saveCredentials(credentials) {
  storage.set('jira_credentials', credentials, (error) => {
    if (error) throw error;
  });
}

function saveToken(token) {
  storage.set('desktop_tracker_jwt', token, (error) => {
    if (error) throw error;
  });
}

function deleteToken() {
  storage.remove('desktop_tracker_jwt');
}

export default function jira(state = initialState, action) {
  switch (action.type) {
    case types.INSTALL_UPDATES:
      return state.set('installUpdate', true);
    case types.CONNECT:
      return state
              .set('client', action.jiraClient)
              .set('credentials', Immutable.fromJS(action.credentials));
    case types.THROW_ERROR:
      return state.set('error', action.error).set('connected', false);
    case types.MEMORIZE_FORM:
      saveCredentials(state.credentials);
      return state;
    case types.LOGOUT:
      deleteToken();
      return initialState;
    case types.SAVE_JWT:
      saveToken(action.token);
      return state.set('jwt', action.token);
    case types.GET_JWT:
      return state.set('jwt', action.token);
    case types.GET_SAVED_CREDENTIALS:
      return state.set('credentials', Immutable.fromJS(action.credentials));
    case types.GET_SELF:
      return state.set('self', Immutable.fromJS(action.self));
    case types.SET_AUTH_SUCCEEDED:
      return state.set('connected', true);
    case types.SET_CONNECT_FETCH_STATE:
      return state.set('fetching', action.payload);
    case types.SET_CONNECTION_STATUS:
      return state.set('online', action.payload);
    default:
      return state;
  }
}
