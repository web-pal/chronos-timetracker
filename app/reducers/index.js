import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form/immutable';

import profile from './profile';
import timer from './timer';
import ui from './ui';
import issues from './issues';
import worklogs from './worklogs';
import projects from './projects';
import settings from './settings';
import loadingBar from './loadingBar';

const rootReducer = combineReducers({
  profile,
  timer,
  ui,
  issues,
  worklogs,
  projects,
  settings,
  loadingBar,
  form: formReducer,
});

export default rootReducer;
