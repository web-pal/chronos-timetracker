import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form/immutable';

import jira from './jira';
import tracker from './tracker';
import ui from './ui';
import issues from './issues';
import filter from './filter';
import worklogs from './worklogs';
import projects from './projects';
import settings from './settings';

const rootReducer = combineReducers({
  jira,
  tracker,
  ui,
  issues,
  worklogs,
  filter,
  projects,
  settings,
  form: formReducer,
});

export default rootReducer;
