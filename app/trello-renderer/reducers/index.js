// @flow
import {
  combineReducers,
} from 'redux';

import {
  windowsManager,
} from 'shared/reducers';

import ui from './ui';


const rootReducer = combineReducers({
  ui,
  windowsManager,
});

export default rootReducer;
