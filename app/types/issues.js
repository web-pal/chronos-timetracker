import { types } from 'actions';
import type { Id, User, Project } from './index';

// TODO type for screenshot
export type Screenshot = any;

export type Component = {
  self: string,
  id: string,
  name: string,
};

export type Version = {
  self: string,
  id: string,
  description: string,
  name: string,
  archived: boolean,
  released: boolean,
};

export type IssueLabel = string;

export type IssueType = {
  avatarId?: number,
  description: string,
  iconUrl: string,
  id: string,
  name: string,
  self: string,
  subtask: boolean,
};

export type IssuePriority = {
  iconUrl: string,
  id: string,
  name: string,
  self: string,
};

export type IssueResolution = {
  self: string,
  id: string,
  description: string,
  name: string,
};

export type IssueStatusCategory = {
  colorName: string,
  id: number,
  key: string,
  name: string,
  self: string,
};

export type IssueStatus = {
  description: string,
  iconUrl: string,
  id: string,
  name: string,
  self: string,
  statusCategory: IssueStatusCategory,
};

// TODO type for worklogs
export type Worklog = any;

export type IssueWorklog = {
  startAt: number,
  maxResults: number,
  total: number,
  worklogs: Array<Worklog>,
};

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
};

export type IssuesMap = { [Id]: Issue };

export type IssuesMeta = {|
  +fetching: boolean,
  +totalCount: number,
  +lastStopIndex: number,
  +selectedIssueId: Id | null,
  +trackingIssueId: Id | null,
  +searchValue: string,
  +screenshots: Array<Screenshot>,
|}

export type IssuesState = {|
  +allIds: Array<Id>,
  +byId: IssuesMap,
  +recentIds: Array<Id>,
  +meta: IssuesMeta,
|}

//
export type FetchIssuesRequestAction =
  {| type: typeof types.FETCH_ISSUES_REQUEST, payload: { startIndex: ?number, stopIndex: ?number }|}

export type FetchIssuesRequest = {
  (startIndex: ?number, stopIndex: ?number): FetchIssuesRequestAction
}

//
export type FillIssuesAction =
  {| type: typeof types.FILL_ISSUES, payload: { ids: Array<Id>, map: IssuesMap }|};

export type FillIssues = {
  (payload: { ids: Array<Id>, map: IssuesMap }): FillIssuesAction
}

//
export type FillRecentIssueIdsAction =
  {| type: typeof types.FILL_RECENT_ISSUE_IDS, payload: Array<Id> |};

export type FillRecentIssueIds = {
  (payload: Array<Id>): FillRecentIssueIdsAction
}

//
export type AddIssuesAction =
  {| type: typeof types.ADD_ISSUES, payload: { ids: Array<Id>, map: IssuesMap }|};

export type AddIssues = {
  (payload: { ids: Array<Id>, map: IssuesMap }): AddIssuesAction
}

//
export type ClearIssuesAction =
  {| type: typeof types.CLEAR_ISSUES |};

export type ClearIssues = {
  (): ClearIssuesAction
}

//
export type SetIssuesFetchingAction =
  {| type: typeof types.SET_ISSUES_FETCHING, +payload: boolean |};

export type SetIssuesFetching = {
  (payload: boolean): SetIssuesFetchingAction
}

//
export type SetIssuesTotalCountAction =
  {| type: typeof types.SET_ISSUES_TOTAL_COUNT, +payload: number |};

export type SetIssuesTotalCount = {
  (payload: number): SetIssuesTotalCountAction
}

//
export type SelectIssueAction =
  {| type: typeof types.SELECT_ISSUE, +payload: Id | null |};

export type SelectIssue = {
  (payload: Id | null): SelectIssueAction,
}

//
export type SetTrackingIssueAction =
  {| type: typeof types.SET_TRACKING_ISSUE, +payload: Id |};

export type SetTrackingIssue = {
  (payload: Id): SetTrackingIssueAction,
}

//
export type SetIssuesSearchValueAction =
  {| type: typeof types.SET_ISSUES_SEARCH_VALUE, +payload: string |};

export type SetIssuesSearchValue = {
  (payload: string): SetIssuesSearchValueAction
}

export type IssuesAction =
  FetchIssuesRequestAction
  | FillIssuesAction
  | AddIssuesAction
  | ClearIssuesAction
  | SetIssuesFetchingAction
  | SetIssuesTotalCountAction
  | SelectIssueAction
  | SetTrackingIssueAction
  | SetIssuesSearchValueAction;
