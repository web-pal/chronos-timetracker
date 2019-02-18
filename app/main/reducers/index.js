// @flow
import {
  combineReducers,
} from 'redux';
import {
  windowsManager,
} from 'shared/reducers';

const rootReducer = combineReducers({
  windowsManager,
});

export default rootReducer;
