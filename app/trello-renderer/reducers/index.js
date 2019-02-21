// @flow
import {
  combineReducers,
} from 'redux';

import ui from './ui';


const rootReducer = combineReducers({
  ui,
});

export default rootReducer;
