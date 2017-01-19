import moment from 'moment';
import { normalize } from 'normalizr';

import { issueSchema } from '../schemas/';
import * as types from '../constants';

function setIssuesFetchState(value) {
  return {
    type: types.SET_ISSUES_FETCH_STATE,
    payload: value,
  };
}

export function fetchLastWeekLoggedIssues() {
  return (dispatch, getState) => new Promise((resolve, reject) => {
    dispatch(setIssuesFetchState(true));
    const jiraClient = getState().jira.client;
    const currentProjectKey = getState().context.currentProject.get('key');
    const self = getState().jira.self;
    const tillDate = moment()
                      .startOf('day')
                      .subtract('1', 'week')
                      .format('Y-M-DD');
    jiraClient.search.search({
      jql: `project = ${currentProjectKey} AND\
            assignee = ${self.get('key')} AND\
            timespent > 0 AND\
            worklogDate >= ${tillDate}`,
      maxResults: 1000,
      fields: ['summary', 'resolution', 'status', 'worklog'],
    }, (error, response) => {
      if (error) throw error;
      const issues = Array.from(response.issues);
      // eslint-disable-next-line no-param-reassign
      issues.forEach(issue => issue.recent = true);
      const normalizedData = normalize(issues, [issueSchema]);
      dispatch({
        type: types.FILL_ISSUES,
        payload: {
          map: normalizedData.entities.issues,
          ids: normalizedData.result,
        },
      });
      dispatch({
        type: types.FILL_WORKLOGS,
        payload: {
          map: normalizedData.entities.worklogs,
          ids: Object.keys(normalizedData.entities.worklogs),
        },
      });
      dispatch(setIssuesFetchState(false));
    });
  });
}

export function fetchIssues(pagination = { startIndex: 0, stopIndex: 1 }) {
  const { startIndex, stopIndex } = pagination;
  return (dispatch, getState) => new Promise((resolve, reject) => {
    dispatch(setIssuesFetchState(true));
    const jiraClient = getState().jira.client;
    const currentProject = getState().context.currentProject;
    const currentProjectKey = currentProject.get('key');
    jiraClient.search.search({
      jql: `project = ${currentProjectKey}`,
      maxResults: stopIndex - startIndex + 1,
      startAt: startIndex,
      fields: ['summary', 'resolution', 'status', 'worklog'],
    }, (error, response) => {
      if (error) {
        dispatch({
          type: types.THROW_ERROR,
          error,
        });
        reject(error);
      }
      const issues = response.issues;
      const normalizedData = normalize(issues, [issueSchema]);
      dispatch({
        type: types.GET_ISSUES_COUNT,
        payload: response.total,
      });
      dispatch({
        type: types.ADD_ISSUES,
        payload: {
          map: normalizedData.entities.issues,
          ids: normalizedData.result,
        },
      });
      dispatch({
        type: types.ADD_WORKLOGS,
        payload: {
          map: normalizedData.entities.worklogs,
          ids: Object.keys(normalizedData.entities.worklogs),
        },
      });
      dispatch(setIssuesFetchState(false));
      resolve('done');
    });
  });
}

function selectIssue(issueId) {
  return {
    type: types.SELECT_ISSUE,
    payload: issueId,
  };
}
