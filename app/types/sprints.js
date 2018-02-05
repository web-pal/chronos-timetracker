// @flow
import * as actionTypes from '../actions/actionTypes/sprints';
import type {
  Id,
} from './';


export type SprintsAction =
  {|
    type: typeof actionTypes.FETCH_SPRINTS_REQUEST,
  |};

export type Sprint = any;

export type SprintsResources = {
  [Id]: Sprint,
}
