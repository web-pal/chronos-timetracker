import * as types from '../constants';


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

export function uploadScreenshot(screenshotInfo) {
  return {
    type: types.UPLOAD_SCREENSHOT_REQUEST,
    screenshotInfo,
  };
}

export function rejectScreenshot(screenshotPath) {
  return {
    type: types.REJECT_SCREENSHOT_REQUEST,
    screenshotPath,
  };
}

export function setDescription(description) {
  return {
    type: types.SET_CURRENT_DESCRIPTION,
    payload: description,
  };
}

export function setWorklogUploadState(payload) {
  return {
    type: types.SET_WORKLOG_UPLOAD_STATE,
    payload,
  };
}

export function selectWorklogType(worklogType) {
  return {
    type: types.SELECT_WORKLOG_TYPE,
    payload: worklogType,
  };
}

export function updateWorklogType(worklogType, worklogId) {
  return {
    type: types.UPDATE_WORKLOG_TYPE_REQUEST,
    payload: { worklogType, worklogId },
  };
}

