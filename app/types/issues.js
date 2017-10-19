import { types } from 'actions';
import type { Id, User, Project } from './index';

import type { Worklog } from './worklogs';

// TODO type for screenshot
export type Screenshot = any

export type Component = {
  self: string,
  id: string,
  name: string,
}

export type Version = {
  self: string,
  id: string,
  description: string,
  name: string,
  archived: boolean,
  released: boolean,
}

export type IssueLabel = string

export type IssueType = {
  avatarId?: number,
  description: string,
  iconUrl: string,
  id: string,
  name: string,
  self: string,
  subtask?: boolean,
}

export type IssuePriority = {
  iconUrl: string,
  id: string,
  name: string,
  self: string,
}

export type IssueResolution = {
  self: string,
  id: string,
  description: string,
  name: string,
}

export type IssueStatusCategory = {
  colorName: string,
  id: number,
  key: string,
  name: string,
  self: string,
}

export type IssueStatus = {
  description: string,
  iconUrl: string,
  id: string,
  name: string,
  self: string,
  statusCategory: IssueStatusCategory,
}

export type IssueWorklog = {
  startAt: number,
  maxResults: number,
  total: number,
  worklogs: Array<Worklog>,
}

export type Issue = {
  expand?: string,
  id: string,
  self: string,
  key: string,
  fields: {
    summary: string,
    issuetype: IssueType,
    components: Array<Component>,
    timespent: number | null,
    description: string | null,
    project: Project,
    reporter: User,
    fixVersions: Array<Version>,
    priority: IssuePriority,
    resolution: IssueResolution | null,
    labels: Array<IssueLabel>,
    timeestimate: number | null,
    versions: Array<Version>,
    worklog: IssueWorklog,
    assignee: User | null,
    status: IssueStatus,
  },
} | any;

export type IssuesMap = { [Id]: Issue }
export type IssueTypesMap = { [Id]: IssueType }
export type IssueStatusesMap = { [Id]: IssueType }

export type IssueFilters = {
  type: Array<Id>,
  status: Array<Id>,
  assignee: Array<string>,
}

export type IssuesMeta = {|
  +fetching: boolean,
  +recentFetching: boolean,
  +searching: boolean,
  +totalCount: number,
  +lastStopIndex: number,
  +selectedIssueId: Id | null,
  +trackingIssueId: Id | null,
  +selectedIssue: Issue | null,
  +trackingIssue: Issue | null,
  +searchValue: string,
  +filters: IssueFilters,
|}

export type IssuesState = {|
  +allIds: Array<Id>,
  +byId: IssuesMap,
  +issueTypesIds: Array<Id>,
  +issueTypesById: IssueTypesMap,
  +issueStatusesIds: Array<Id>,
  +issueStatusesById: IssueStatusesMap,
  +recentIds: Array<Id>,
  +foundIds: Array<Id>,
  +meta: IssuesMeta,
|}

//
export type FetchIssuesRequestAction =
  {|
    type: typeof types.FETCH_ISSUES_REQUEST,
    payload: { startIndex: ?number, stopIndex: ?number, search: ?boolean }
  |}

export type FetchIssuesRequest = {
  (payload: {
    startIndex: ?number,
    stopIndex: ?number,
    search: ?boolean,
  }): FetchIssuesRequestAction
}

//
export type FillIssuesAction =
  {| type: typeof types.FILL_ISSUES, payload: { ids: Array<Id>, map: IssuesMap }|}

export type FillIssues = {
  (payload: { ids: Array<Id>, map: IssuesMap }): FillIssuesAction
}

//
export type FillRecentIssueIdsAction =
  {| type: typeof types.FILL_RECENT_ISSUE_IDS, payload: Array<Id> |}

export type FillRecentIssueIds = {
  (payload: Array<Id>): FillRecentIssueIdsAction
}

//
export type FillIssueTypesAction =
  {| type: typeof types.FILL_ISSUE_TYPES, payload: { ids: Array<Id>, map: IssueTypesMap }|}

export type FillIssueTypes = {
  (payload: { ids: Array<Id>, map: IssueTypesMap }): FillIssueTypesAction
}

//
export type FillIssueStatusesAction =
  {| type: typeof types.FILL_ISSUE_STATUSES, payload: { ids: Array<Id>, map: IssueStatusesMap }|}

export type FillIssueStatuses = {
  (payload: { ids: Array<Id>, map: IssueStatusesMap }): FillIssueStatusesAction
}

//
export type FillFoundIssueIdsAction =
  {| type: typeof types.FILL_FOUND_ISSUE_IDS, payload: Array<Id> |}

export type FillFoundIssueIds = {
  (payload: Array<Id>): FillFoundIssueIdsAction
}

//
export type AddFoundIssueIdsAction =
  {| type: typeof types.ADD_FOUND_ISSUE_IDS, payload: Array<Id> |}

export type AddFoundIssueIds = {
  (payload: Array<Id>): AddFoundIssueIdsAction
}

//
export type AddIssuesAction =
  {| type: typeof types.ADD_ISSUES, payload: { ids: Array<Id>, map: IssuesMap }|}

export type AddIssues = {
  (payload: { ids: Array<Id>, map: IssuesMap }): AddIssuesAction
}

//
export type ClearIssuesAction =
  {| type: typeof types.CLEAR_ISSUES |}

export type ClearIssues = {
  (): ClearIssuesAction
}

//
export type SetIssuesFetchingAction =
  {| type: typeof types.SET_ISSUES_FETCHING, +payload: boolean |}

export type SetIssuesFetching = {
  (payload: boolean): SetIssuesFetchingAction
}

//
export type SetRecentIssuesFetchingAction =
  {| type: typeof types.SET_RECENT_ISSUES_FETCHING, +payload: boolean |}

export type SetRecentIssuesFetching = {
  (payload: boolean): SetRecentIssuesFetchingAction
}

//
export type SetIssuesTotalCountAction =
  {| type: typeof types.SET_ISSUES_TOTAL_COUNT, +payload: number |}

export type SetIssuesTotalCount = {
  (payload: number): SetIssuesTotalCountAction
}

//
export type SelectIssueAction =
  {| type: typeof types.SELECT_ISSUE, +payload: Issue | null |}

export type SelectIssue = {
  (payload: Issue | null): SelectIssueAction,
}

//
export type SetTrackingIssueAction =
  {| type: typeof types.SET_TRACKING_ISSUE, +payload: Issue |}

export type SetTrackingIssue = {
  (payload: Issue): SetTrackingIssueAction,
}

//
export type SetIssuesSearchValueAction =
  {| type: typeof types.SET_ISSUES_SEARCH_VALUE, +payload: string |}

export type SetIssuesSearchValue = {
  (payload: string): SetIssuesSearchValueAction
}

//
export type SetIssuesFilterAction =
  {| type: typeof types.SET_ISSUES_FILTER, payload: Array<string>, meta: { filterName: string } |}

export type SetIssuesFilter = {
  (value: Array<string>, filterName: string): SetIssuesFilterAction
}

export type IssuesAction =
  FetchIssuesRequestAction
  | FillIssuesAction
  | FillIssueTypesAction
  | FillIssueStatusesAction
  | AddIssuesAction
  | ClearIssuesAction
  | SetIssuesFetchingAction
  | SetIssuesTotalCountAction
  | SelectIssueAction
  | SetTrackingIssueAction
  | SetIssuesSearchValueAction
  | SetIssuesFilterAction;
