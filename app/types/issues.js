// @flow
import * as actionTypes from '../actions/actionTypes/issues';
import type {
  Id,
  IssueField,
} from './';

export type IssuesAction =
  {|
    type: typeof actionTypes.FETCH_ISSUES_REQUEST,
    payload: {|
      startIndex: number,
      stopIndex: number,
      resolve: null | () => void,
    |},
  |} |
  {|
    type: typeof actionTypes.FETCH_RECENT_ISSUES_REQUEST,
  |} |
  {|
    type: typeof actionTypes.REFETCH_ISSUES_REQUEST,
    debouncing: boolean,
  |} |
  {|
    type: typeof actionTypes.SELECT_ISSUE,
    payload: any,
    meta: any,
  |} |
  {|
    type: typeof actionTypes.TRANSITION_ISSUE_REQUEST,
    transitionId: Id,
    issueId: Id,
  |} |
  {|
    type: typeof actionTypes.COMMENT_REQUEST,
    text: string,
    issueId: Id,
  |} |
  {|
    type: typeof actionTypes.ASSIGN_ISSUE_REQUEST,
    issueId: number | string,
  |};

export type Issue = {
  expand?: string,
  id: string,
  self: string,
  key: string,
  fields: IssueField,
  renderedFields: any,
};

export type IssuesResources = {
  [Id]: Issue,
}
