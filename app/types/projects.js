// @flow
import * as actionTypes from '../actions/actionTypes/projects';
import type {
  Id,
} from './';


export type ProjectsAction =
  {|
    type: typeof actionTypes.FETCH_PROJECT_STATUSES_REQUEST,
  |};

export type Project = any;

export type ProjectsResources = {
  [Id]: Project,
}
