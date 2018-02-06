// @flow
import * as actionTypes from '../actions/actionTypes/projects';
import type {
  Id,
} from './';


export type ProjectsAction =
  {|
    type: typeof actionTypes.FETCH_PROJECT_STATUSES_REQUEST,
  |};

export type Project = {
  avatarUrls: {
    '16x16': string,
    '24x24': string,
    '32x32': string,
    '48x48': string,
  },
  expand?: string,
  id: string,
  key: string,
  name: string,
  projectTypeKey?: string,
  self: string,
  simplified: boolean,
};

export type ProjectsResources = {
  [Id]: Project,
}
