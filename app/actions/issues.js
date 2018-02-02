// @flow
import type {
  IssuesAction,
} from '../types/issues';

import * as actionTypes from './actionTypes';


export const fetchIssuesRequest = (
  payload: {|
      startIndex: number,
      stopIndex: number,
      resolve: null | () => void,
  |} = {
    startIndex: 0,
    stopIndex: 10,
    resolve: null,
  },
): IssuesAction => ({
  type: actionTypes.FETCH_ISSUES_REQUEST,
  payload,
});

export const fetchRecentIssuesRequest = (
): IssuesAction => ({
  type: actionTypes.FETCH_RECENT_ISSUES_REQUEST,
});

export const refetchIssuesRequest = (
  debouncing : boolean = false,
): IssuesAction => ({
  type: actionTypes.REFETCH_ISSUES_REQUEST,
  debouncing,
});

export const selectIssue = (
  payload: any,
  meta: any,
): IssuesAction => ({
  type: actionTypes.SELECT_ISSUE,
  payload,
  meta,
});

export const transitionIssueRequest = (
  transitionId: string | number,
  issueId: string | number,
): IssuesAction => ({
  type: actionTypes.TRANSITION_ISSUE_REQUEST,
  transitionId,
  issueId,
});

export const commentRequest = (
  text: string,
  issueId: number,
): IssuesAction => ({
  type: actionTypes.COMMENT_REQUEST,
  text,
  issueId,
});

export const assignIssueRequest = (
  issueId: number | string,
): IssuesAction => ({
  type: actionTypes.ASSIGN_ISSUE_REQUEST,
  issueId,
});
