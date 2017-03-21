import { normalize, schema } from 'normalizr';

import { issueSchema, worklogSchema } from '../schemas/';
import * as types from '../constants';

const requiredFields = [
  'issuetype',
  'labels',
  'priority',
  'status',
  'resolution',
  'summary',
  'reporter',
  'assignee',
  'description',
  'worklog',
  'timeestimate',
  'timespent',
];

export function updateIssueTime(issueId, time) {
  return {
    type: types.UPDATE_ISSUE_TIME,
    payload: {
      time,
      issueId,
    },
  };
}

function setIssuesFetchState(value) {
  return {
    type: types.SET_ISSUES_FETCH_STATE,
    payload: value,
  };
}

export function searchIssues() {
  return {
    type: types.FETCH_SEARCH_ISSUES_REQUEST,
  };
}


function fetchAdditionalWorklogs(issues) {
  return (dispatch, getState) => {
    const jiraClient = getState().jira.client;
    if (!jiraClient) return;
    dispatch(setIssuesFetchState(true));
    for (const issue of issues) {
      const fuck = setInterval(() => {
        jiraClient.issue.getWorkLogs({ issueId: issue.id }, (err, response) => {
          const normalizedData = normalize(response.worklogs, [worklogSchema]);
          dispatch({
            type: types.ADD_WORKLOGS,
            payload: {
              map: normalizedData.entities.worklogs,
              ids: normalizedData.result,
            },
          });
          dispatch({
            type: types.ADD_RECENT_WORKLOGS,
            payload: normalizedData.result,
          });
          dispatch(setIssuesFetchState(false));
          clearInterval(fuck);
        });
      }, 1000);
    };
  };
}

export function fetchLastWeekLoggedIssuess() {
  return (dispatch, getState) => new Promise((resolve, reject) => {
    const jiraClient = getState().jira.client;
    if (!jiraClient) return;
    dispatch(setIssuesFetchState(true));
    const currentProjectKey = getState().projects.meta.get('selected');
    const self = getState().jira.self;
    jiraClient.search.search({
      jql: `project = ${currentProjectKey} AND
 worklogAuthor = ${self.get('key')} AND
 timespent > 0 AND
 worklogDate >= '-4w'`,
      maxResults: 1000,
      fields: requiredFields,
    }, (error, response) => {
      if (error) reject(error);
      const issues = response.issues;
      const incompleteIssues = issues.filter(issue => issue.fields.worklog.total > 20);
      if (incompleteIssues.length) {
        dispatch(fetchAdditionalWorklogs(incompleteIssues));
      }
      const normalizedData = normalize(issues, [issueSchema]);
      if (normalizedData.entities.issues) {
        dispatch({
          type: types.FILL_RECENT_ISSUES,
          payload: {
            map: normalizedData.entities.issues,
            ids: normalizedData.result,
          },
        });
      }
      if (normalizedData.entities.worklogs) {
        dispatch({
          type: types.FILL_WORKLOGS,
          payload: {
            map: normalizedData.entities.worklogs,
            ids: Object.keys(normalizedData.entities.worklogs || {}),
          },
        });
        dispatch({
          type: types.FILL_RECENT_WORKLOGS,
          payload: Object.keys(normalizedData.entities.worklogs || {}),
        });
      }
      resolve(response);
      dispatch(setIssuesFetchState(false));
    });
  });
}

export function fetchRecentIssues() {
  return {
    type: types.FETCH_RECENT_ISSUES_REQUEST,
  };
}

export function fetchIssues(pagination = { startIndex: 0, stopIndex: 50 }, resolve = false) {
  return {
    type: types.FETCH_ISSUES_REQUEST,
    pagination,
    resolve,
  };
}

export function setIssuesSearchValue(value) {
  return {
    type: types.SET_ISSUES_SEARCH_VALUE,
    payload: value,
  };
}

export function selectIssue(issueId) {
  return {
    type: types.SELECT_ISSUE,
    payload: issueId,
  };
}

export function clearIssues() {
  return {
    type: types.CLEAR_ISSUES,
  };
}

export function addRecentIssue(issueId) {
  return (dispatch, getState) => {
    const issue = getState().issues.byId.get(issueId) || getState().issues.recentById.get(issueId);
    dispatch({
      type: types.ADD_RECENT_ISSUE,
      payload: {
        id: issueId,
        issue,
      },
    });
  };
}

export function clearTrackingIssue() {
  return {
    type: types.CLEAR_TRACKING_ISSUE,
  };
}

