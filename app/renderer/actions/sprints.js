// @flow
import type {
  SprintsAction,
} from 'types';

import * as types from './actionTypes';


export const fetchSprintsRequest = (): SprintsAction => ({
  type: types.FETCH_SPRINTS_REQUEST,
});
