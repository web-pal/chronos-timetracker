import * as types from '../constants/';


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
