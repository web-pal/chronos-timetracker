import * as types from '../constants';

export function fetchIssues(pagination = { startIndex: 0, stopIndex: 50 }, resolve = false) {
  return {
    type: types.FETCH_ISSUES_REQUEST,
    pagination,
    resolve,
  };
}

export function fetchIssuesAllTypes() {
  return {
    type: types.FETCH_ISSUES_ALL_TYPES_REQUEST,
  };
}

export function fetchIssuesAllStatuses() {
  return {
    type: types.FETCH_ISSUES_ALL_STATUSES_REQUEST,
  };
}

export function fetchRecentIssues() {
  return {
    type: types.FETCH_RECENT_ISSUES_REQUEST,
  };
}

export function searchIssues() {
  return {
    type: types.FETCH_SEARCH_ISSUES_REQUEST,
  };
}

export function setIssuesSearchValue(value) {
  return {
    type: types.SET_ISSUES_SEARCH_VALUE,
    payload: value,
  };
}

export function setFilterOfIssuesFiltersValue(value, filterName) {
  return {
    type: types.SET_FILTER_OF_ISSUES_CRITERIA_FILTERS,
    payload: { value },
    meta: { filterName },
  };
}

export function setIssuesCriteriaFilter(
  value,
  criteriaName,
  del,
  pagination = { startIndex: 0, stopIndex: 50 },
) {
  return {
    type: del ? types.DELETE_ISSUES_CRITERIA_FILTER : types.SET_ISSUES_CRITERIA_FILTER,
    payload: { value },
    meta: { criteriaName },
    pagination,
  };
}


export function setShowingFilterCriteriaBlock(key, value) {
  return {
    type: types.SET_SHOWING_FILTER_CRITERIA_BLOCK,
    payload: value,
    meta: key,
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
