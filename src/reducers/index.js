import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';

import jira from './jira';
import context from './context';
import tracker from './tracker';
import ui from './ui';

const rootReducer = combineReducers({
  jira,
  context,
  tracker,
  ui,
  form: formReducer,
});

export default rootReducer;
