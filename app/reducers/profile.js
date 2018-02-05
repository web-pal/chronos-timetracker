// @flow
import {
  actionTypes,
} from 'actions';

import type {
  ProfileState,
  Action,
} from '../types';


const initialState: ProfileState = {
  userData: null,
};

function profile(
  state: ProfileState = initialState,
  action: Action,
) {
  switch (action.type) {
    case actionTypes.FILL_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };
    case actionTypes.__CLEAR_ALL_REDUCERS__:
      return initialState;
    default:
      return state;
  }
}

export default profile;
