// @flow
import type {
  ProjectsAction,
} from '../types/projects';

import * as actionTypes from './actionTypes';


export const fetchProjectStatusesRequest = (): ProjectsAction => ({
  type: actionTypes.FETCH_PROJECT_STATUSES_REQUEST,
});
