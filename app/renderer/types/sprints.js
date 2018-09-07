// @flow
import * as actionTypes from '../actions/actionTypes/sprints';
import type {
  Id,
} from './';


export type SprintsAction =
  {|
    type: typeof actionTypes.FETCH_SPRINTS_REQUEST,
  |};

export type Sprint = {
  id: number,
  self: string,
  state: string,
  name: string,
  startDate: string,
  endDate: string,
  completeDate: string,
  originBoardId: number,
  goal: string,
};

export type SprintsResources = {
  [Id]: Sprint,
}
