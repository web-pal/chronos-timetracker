// @flow
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import profile from './profile';
import ui from './ui';
import settings from './settings';
import projects from './projects';
import issues from './issues';
import timer from './timer';
import worklogs from './worklogs';

const rootReducer = combineReducers({
  profile,
  ui,
  settings,
  projects,
  issues,
  timer,
  worklogs,
  form: formReducer,
});

export default rootReducer;
