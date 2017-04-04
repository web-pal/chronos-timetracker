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
    type: types.SET_FITER_OF_ISSUES_CRITERIA_FILTERS,
    payload: { value, filterName },
  };
}


export function setShowingFilterCriteriaBlock(value) {
  return {
    type: types.SET_SHOWING_FILTER_CRITERIA_BLOCK,
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
