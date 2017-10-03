import * as types from './actionTypes';
import type {
  FetchIssuesRequest, FetchIssuesRequestAction,
  FillIssues, FillIssuesAction,
  FillRecentIssueIds, FillRecentIssueIdsAction,
  AddIssues, AddIssuesAction,
  ClearIssues, ClearIssuesAction,
  SetIssuesFetching, SetIssuesFetchingAction,
  SetIssuesTotalCount, SetIssuesTotalCountAction,
  SelectIssue, SelectIssueAction,
  SetTrackingIssue, SetTrackingIssueAction,
  SetIssuesSearchValue, SetIssuesSearchValueAction,
  IssuesMap, Id,
} from '../types';

export const fetchIssuesRequest: FetchIssuesRequest = (
  payload: {
    startIndex: number,
    stopIndex: number,
  } = { startIndex: 0, stopIndex: 10 },
): FetchIssuesRequestAction => ({
  type: types.FETCH_ISSUES_REQUEST,
  payload,
});

export const fillIssues: FillIssues = (
  payload: { ids: Array<Id>, map: IssuesMap },
): FillIssuesAction => ({
  type: types.FILL_ISSUES,
  payload,
});

export const fillRecentIssueIds: FillRecentIssueIds = (
  payload: Array<Id>,
): FillRecentIssueIdsAction => ({
  type: types.FILL_RECENT_ISSUE_IDS,
  payload,
});

export const addIssues: AddIssues = (
  payload: { ids: Array<Id>, map: IssuesMap },
): AddIssuesAction => ({
  type: types.ADD_ISSUES,
  payload,
});

export const clearIssues: ClearIssues = (): ClearIssuesAction => ({ type: types.CLEAR_ISSUES });

export const setIssuesFetching: SetIssuesFetching = (
  payload: boolean,
): SetIssuesFetchingAction => ({
  type: types.SET_ISSUES_FETCHING,
  payload,
});

export const setIssuesTotalCount: SetIssuesTotalCount = (
  payload: number,
): SetIssuesTotalCountAction => ({
  type: types.SET_ISSUES_TOTAL_COUNT,
  payload,
});

export const selectIssue: SelectIssue = (
  payload: Id,
): SelectIssueAction => ({
  type: types.SELECT_ISSUE,
  payload,
});

export const setTrackingIssue: SetTrackingIssue = (
  payload: Id,
): SetTrackingIssueAction => ({
  type: types.SET_TRACKING_ISSUE,
  payload,
});

export const setIssuesSearchValue: SetIssuesSearchValue = (
  payload: string,
): SetIssuesSearchValueAction => ({
  type: types.SET_ISSUES_SEARCH_VALUE,
  payload,
});
