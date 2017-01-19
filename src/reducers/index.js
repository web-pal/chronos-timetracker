import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form/immutable';

import jira from './jira';
import context from './context';
import tracker from './tracker';
import ui from './ui';
import issues from './issues';
import worklogs from './worklogs';

const rootReducer = combineReducers({
  jira,
  context,
  tracker,
  ui,
  issues,
  worklogs,
  form: formReducer,
});

export default rootReducer;
