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

function profile(state: ProfileState = initialState, action: Action) {
  switch (action.type) {
    case actionTypes.FILL_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };
    case actionTypes.___CLEAR_ALL_REDUCERS___:
      return initialState;
    default:
      return state;
  }
}

export default profile;
