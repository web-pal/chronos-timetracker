// @flow
import type {
  Id,
  IssuesAction,
} from 'types';

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

export const fetchRecentIssuesRequest = (): IssuesAction => ({
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
  transitionId: Id,
  issueId: Id,
): IssuesAction => ({
  type: actionTypes.TRANSITION_ISSUE_REQUEST,
  transitionId,
  issueId,
});

export const commentRequest = (
  text: string,
  issueId: Id,
): IssuesAction => ({
  type: actionTypes.COMMENT_REQUEST,
  text,
  issueId,
});

export const assignIssueRequest = (
  issueId: Id,
): IssuesAction => ({
  type: actionTypes.ASSIGN_ISSUE_REQUEST,
  issueId,
});

export const fetchNewIssueRequest = ({ issueIdOrKey }): IssuesAction => ({
  type: actionTypes.FETCH_NEW_ISSUE_REQUEST,
  issueIdOrKey,
  scope: 'allRenderer',
});

export const fetchUpdateIssueRequest = ({ issueIdOrKey }): IssuesAction => ({
  type: actionTypes.FETCH_UPDATE_ISSUE_REQUEST,
  issueIdOrKey,
  scope: 'allRenderer',
});

export const showIssueFormWindow = ({
  issueId,
  projectId,
}): IssuesAction => ({
  type: actionTypes.SHOW_ISSUE_FORM_WINDOW,
  issueId,
  projectId,
  scope: 'allRenderer',
});

export const closeIssueFormWindow = (): IssuesAction => ({
  type: actionTypes.CLOSE_ISSUE_FORM_WINDOW,
  scope: 'allRenderer',
});

export const showAttachmentWindow = ({ issueId, activeIndex }): IssuesAction => ({
  type: actionTypes.SHOW_ATTACHMENT_WINDOW,
  issueId,
  activeIndex,
});

export const setAttachments = ({
  attachments,
  activeIndex,
  scope,
}): IssuesAction => ({
  type: actionTypes.SET_ATTACHMENTS,
  attachments,
  activeIndex,
  scope,
});
