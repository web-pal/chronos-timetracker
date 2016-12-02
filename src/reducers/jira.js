import storage from 'electron-json-storage';

import * as types from '../constants/jira';

const InitialState = Immutable.Record({
  self: Immutable.Map({}),
  client: null,
  error: null,
  connected: false,
  credentials: Immutable.Map({}),
  jwt: null,
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

export default function jira(state = initialState, action) {
  switch (action.type) {
    case types.CONNECT:
      return state
              .set('client', action.jiraClient)
              .set('credentials', Immutable.fromJS(action.credentials));
    case types.THROW_ERROR:
      return state.set('error', action.error).set('connected', false);
    case types.MEMORIZE_FORM:
      saveCredentials(state.credentials);
      return state;
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
    default:
      return state;
  }
}
