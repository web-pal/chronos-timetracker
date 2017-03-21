import * as types from '../constants/';

export function addRecentWorklog(worklog) {
  return {
    type: types.ADD_RECENT_WORKLOG,
    payload: worklog,
  };
}

export function clearWorklogs() {
  return {
    type: types.CLEAR_WORKLOGS,
  };
}

export function selectWorklogByIssueId(issueId) {
  return {
    type: types.SELECT_WORKLOG_BY_ISSUE_ID,
    issueId,
  };
}

export function selectWorklog(worklogId) {
  return {
    type: types.SELECT_WORKLOG,
    payload: worklogId,
  };
}
