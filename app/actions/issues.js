import * as types from './actionTypes';
import type {
  FetchIssuesRequest, FetchIssuesRequestAction,
  FillIssues, FillIssuesAction,
  FillRecentIssueIds, FillRecentIssueIdsAction,
  FillFoundIssueIds, FillFoundIssueIdsAction,
  FillIssueTypes, FillIssueTypesAction,
  FillIssueStatuses, FillIssueStatusesAction,
  AddFoundIssueIds, AddFoundIssueIdsAction,
  AddIssues, AddIssuesAction,
  ClearIssues, ClearIssuesAction,
  SetIssuesFetching, SetIssuesFetchingAction,
  SetRecentIssuesFetching, SetRecentIssuesFetchingAction,
  SetIssuesTotalCount, SetIssuesTotalCountAction,
  SelectIssue, SelectIssueAction,
  SetTrackingIssue, SetTrackingIssueAction,
  SetIssuesSearchValue, SetIssuesSearchValueAction,
  SetIssuesFilter, SetIssuesFilterAction,
  AddWorklogToIssue, AddWorklogToIssueAction,
  DeleteWorklogFromIssue, DeleteWorklogFromIssueAction,
  FillAvailableTransitions, FillAvailableTransitionsAction,
  SetAvailableTransitionsFetching, SetAvailableTransitionsFethchingAction,
  TransitionIssueRequest, TransitionIssueRequestAction,
  SetIssueStatus, SetIssueStatusAction,
  AssignIssueRequest, AssignIssueRequestAction,
  SetIssueAssignee, SetIssueAssigneeAction,
  IssuesMap, Id, IssueTypesMap, IssueStatus, IssueStatusesMap, Issue, Worklog, IssueTransition,
  User,
} from '../types';

export const fetchIssuesRequest: FetchIssuesRequest = (
  payload: {
    startIndex: number,
    stopIndex: number,
    search: boolean,
  } = { startIndex: 0, stopIndex: 10, search: false },
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

export const fillFoundIssueIds: FillFoundIssueIds = (
  payload: Array<Id>,
): FillFoundIssueIdsAction => ({
  type: types.FILL_FOUND_ISSUE_IDS,
  payload,
});

export const fillIssueTypes: FillIssueTypes = (
  payload: { ids: Array<Id>, map: IssueTypesMap },
): FillIssueTypesAction => ({
  type: types.FILL_ISSUE_TYPES,
  payload,
});

export const fillIssueStatuses: FillIssueStatuses = (
  payload: { ids: Array<Id>, map: IssueStatusesMap },
): FillIssueStatusesAction => ({
  type: types.FILL_ISSUE_STATUSES,
  payload,
});

export const addFoundIssueIds: AddFoundIssueIds = (
  payload: Array<Id>,
): AddFoundIssueIdsAction => ({
  type: types.ADD_FOUND_ISSUE_IDS,
  payload,
});

export const clearFoundIssueIds = () => ({ type: types.CLEAR_FOUND_ISSUE_IDS });

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

export const setRecentIssuesFetching: SetRecentIssuesFetching = (
  payload: boolean,
): SetRecentIssuesFetchingAction => ({
  type: types.SET_RECENT_ISSUES_FETCHING,
  payload,
});

export const setIssuesTotalCount: SetIssuesTotalCount = (
  payload: number,
): SetIssuesTotalCountAction => ({
  type: types.SET_ISSUES_TOTAL_COUNT,
  payload,
});

export const selectIssue: SelectIssue = (
  payload: Issue | null,
): SelectIssueAction => ({
  type: types.SELECT_ISSUE,
  payload,
});

export const setTrackingIssue: SetTrackingIssue = (
  payload: Issue,
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

export const setIssuesFilter: SetIssuesFilter = (
  value: Array<string>,
  filterName: string,
): SetIssuesFilterAction => ({
  type: types.SET_ISSUES_FILTER,
  payload: value,
  meta: {
    filterName,
  },
});

export const addWorklogToIssue: AddWorklogToIssue = (
  payload: Worklog,
  issueId: Id,
): AddWorklogToIssueAction => ({
  type: types.ADD_WORKLOG_TO_ISSUE,
  payload,
  meta: issueId,
});

export const deleteWorklogFromIssue: DeleteWorklogFromIssue = (
  payload: Worklog,
  issueId: Id,
): DeleteWorklogFromIssueAction => ({
  type: types.DELETE_WORKLOG_FROM_ISSUE,
  payload,
  meta: issueId,
});

export const fillAvailableTransitions: FillAvailableTransitions = (
  payload: Array<IssueTransition>,
): FillAvailableTransitionsAction => ({
  type: types.FILL_AVAILABLE_TRANSITIONS,
  payload,
});

export const setAvailableTransitionsFetching: SetAvailableTransitionsFetching = (
  payload: boolean,
): SetAvailableTransitionsFethchingAction => ({
  type: types.SET_AVAILABLE_TRANSITIONS_FETCHING,
  payload,
});

export const transitionIssueRequest: TransitionIssueRequest = (
  transition: IssueTransition,
  issueToTransition: Issue,
): TransitionIssueRequestAction => ({
  type: types.TRANSITION_ISSUE_REQUEST,
  payload: transition,
  meta: issueToTransition,
});

export const setIssueStatus: SetIssueStatus = (
  status: IssueStatus,
  issue: Issue,
): SetIssueStatusAction => ({
  type: types.SET_ISSUE_STATUS,
  payload: status,
  meta: issue,
});

export const assignIssueRequest: AssignIssueRequest = (
  payload: Issue,
): AssignIssueRequestAction => ({
  type: types.ASSIGN_ISSUE_REQEST,
  payload,
});

export const setIssueAssignee: SetIssueAssignee = (
  assignee: User,
  issue: Issue,
): SetIssueAssigneeAction => ({
  type: types.SET_ISSUE_ASSIGNEE,
  payload: assignee,
  meta: issue,
});
