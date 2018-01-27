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

export type IssueField = {
  id: string,
  key: string,
  name: string,
  custom: boolean,
  orderable: boolean,
  navigable: boolean,
  searchable: boolean,
  clauseNames: Array<string>,
  schema?: {
    type: string,
    system?: string,
  },
};

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

export type IssueTransition = {
  hasScreen: boolean,
  id: string,
  name: string,
  to: IssueStatus,
};

export type IssueComment = {
  author: User,
  body: string,
  created: string,
  id: Id,
  self: string,
  updateAuthor: User,
  updated: string,
};

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
  +fields: Array<IssueField>,
  +availableTransitions: Array<IssueTransition>,
  +availableTransitionsFetching: boolean,
  +comments: Array<IssueComment>,
  +commentsFetching: boolean,
  +commentsAdding: boolean,
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
  +epicsIds: Array<Id>,
  +epicsById: IssuesMap,
  +meta: IssuesMeta,
|}

//
export type FetchIssuesRequestAction =
  {|
    type: typeof types.FETCH_ISSUES_REQUEST,
    +payload: { startIndex: ?number, stopIndex: ?number, search: ?boolean }
  |}

export type FetchIssuesRequest = {
  (payload: {
    startIndex: ?number,
    stopIndex: ?number,
    search: ?boolean,
  }): FetchIssuesRequestAction
}

//
export type FetchRecentIssuesRequestAction =
  {|
    type: typeof types.FETCH_RECENT_ISSUES_REQUEST,
  |}

export type FetchRecentIssuesRequest = {
  (): FetchRecentIssuesRequestAction
}

//
export type FillIssuesAction =
  {| type: typeof types.FILL_ISSUES, +payload: { ids: Array<Id>, map: IssuesMap }|}

export type FillIssues = {
  (payload: { ids: Array<Id>, map: IssuesMap }): FillIssuesAction
}

//
export type FillRecentIssueIdsAction =
  {| type: typeof types.FILL_RECENT_ISSUE_IDS, +payload: Array<Id> |}

export type FillRecentIssueIds = {
  (payload: Array<Id>): FillRecentIssueIdsAction
}

//
export type FillIssueTypesAction =
  {| type: typeof types.FILL_ISSUE_TYPES, +payload: { ids: Array<Id>, map: IssueTypesMap }|}

export type FillIssueTypes = {
  (payload: { ids: Array<Id>, map: IssueTypesMap }): FillIssueTypesAction
}

//
export type FillIssueStatusesAction =
  {| type: typeof types.FILL_ISSUE_STATUSES, +payload: { ids: Array<Id>, map: IssueStatusesMap }|}

export type FillIssueStatuses = {
  (payload: { ids: Array<Id>, map: IssueStatusesMap }): FillIssueStatusesAction
}

//
export type FillFoundIssueIdsAction =
  {| type: typeof types.FILL_FOUND_ISSUE_IDS, +payload: Array<Id> |}

export type FillFoundIssueIds = {
  (payload: Array<Id>): FillFoundIssueIdsAction
}

//
export type AddFoundIssueIdsAction =
  {| type: typeof types.ADD_FOUND_ISSUE_IDS, +payload: Array<Id> |}

export type AddFoundIssueIds = {
  (payload: Array<Id>): AddFoundIssueIdsAction
}

//
export type AddIssuesAction =
  {| type: typeof types.ADD_ISSUES, +payload: { ids: Array<Id>, map: IssuesMap }|}

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
export type SetRefetchIssuesIndicatorAction =
  {| type: typeof types.SET_REFETCH_ISSUES_INDICATOR, +payload: boolean |}

export type SetRefetchIssuesIndicator = {
  (payload: boolean): SetRefetchIssuesIndicatorAction
}

//
export type SetIssuesTotalCountAction =
  {| type: typeof types.SET_ISSUES_TOTAL_COUNT, +payload: number |}

export type SetIssuesTotalCount = {
  (payload: number): SetIssuesTotalCountAction
}

//
export type SelectIssueAction =
  {| type: typeof types.SELECT_ISSUE, +payload: Issue | null, +meta: Worklog | void |}

export type SelectIssue = {
  (payload: Issue | null, meta: Worklog | void): SelectIssueAction,
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
  {| type: typeof types.SET_ISSUES_FILTER, +payload: Array<string>, meta: { filterName: string } |}

export type SetIssuesFilter = {
  (value: Array<string>, filterName: string): SetIssuesFilterAction
}

//
export type AddWorklogToIssueAction =
  {| type: types.ADD_WORKLOG_TO_ISSUE, +payload: Worklog, meta: Id |};

export type AddWorklogToIssue = {
  (payload: Worklog, issueId: Id): AddWorklogToIssueAction
};

//
export type DeleteWorklogFromIssueAction =
  {| type: types.DELETE_WORKLOG_FROM_ISSUE, +payload: Worklog, meta: Id |};

export type DeleteWorklogFromIssue = {
  (payload: Worklog, issueId: Id): DeleteWorklogFromIssueAction
};

//
export type FillAvailableTransitionsAction =
  {| type: types.FILL_AVAILABLE_TRANSITIONS, +payload: Array<IssueTransition> |};

export type FillAvailableTransitions = {
  (payload: Array<IssueTransition>): FillAvailableTransitionsAction
};

//
export type SetAvailableTransitionsFetching =
  {| type: types.SET_AVAILABLE_TRANSITIONS_FETCHING, +payload: boolean |};

export type SetAvailableTransitions = {
  (payload: boolean): SetAvailableTransitionsFetching
};

//
export type TransitionIssueRequestAction =
  {| type: types.TRANSITION_ISSUE_REQUEST, +payload: IssueTransition, meta: Issue |};

export type TransitionIssueRequest = {
  (transition: IssueTransition, issue: Issue): TransitionIssueRequestAction
};

//
export type FillCommentsAction =
  {| type: types.FILL_COMMENTS, +payload: Array<IssueComment> |};

export type FillComments = {
  (payload: Array<IssueComment>): FillCommentsAction
};

//
export type SetCommentsFetchingAction =
  {| type: types.SET_COMMENTS_FETCHING, +payload: boolean |};

export type SetCommentsFetching = {
  (payload: boolean): SetCommentsFetchingAction
};

//
export type CommentRequestAction =
  {| type: types.COMMENT_REQUEST, +payload: string, +meta: Issue |};

export type CommentRequest = {
  (payload: string, meta: Issue): CommentRequestAction
};

//
export type SetCommentsAddingAction =
  {| type: types.SET_COMMENTS_ADDING, +payload: boolean |};

export type SetCommentsAdding = {
  (payload: boolean): SetCommentsAddingAction
};

//
export type SetIssueStatusAction =
  {| type: types.SET_ISSUE_STATUS, +payload: IssueStatus, meta: Issue |};

export type SetIssueStatus = {
  (status: IssueStatus, issue: Issue): SetIssueStatusAction
};

//
export type AssignIssueRequestAction =
  {| type: types.ASSIGN_ISSUE_REQEST, +payload: Issue |};

export type AssignIssueRequest = {
  (payload: Issue): AssignIssueRequestAction
};

//
export type SetIssueAssigneeAction =
  {| type: types.SET_ISSUE_ASSIGNEE, +payload: User, meta: Issue |};

export type SetIssueAssignee = {
  (assignee: User, issue: Issue): SetIssueAssigneeAction
};

//
export type FillIssueFieldsAction =
  {| type: types.FILL_ISSUE_FIELDS, +payload: Array<IssueField> |};

export type FillIssueFields = {
  (payload: Array<IssueField>): FillIssueFieldsAction
};

//
export type FillEpicsAction =
  {| type: types.FILL_EPICS, +payload: { ids: Array<Id>, map: IssuesMap } |};

export type FillEpics = {
  (payload: { ids: Array<Id>, map: IssuesMap }): FillEpicsAction
};

export type IssuesAction =
  FetchIssuesRequestAction
  | FillIssuesAction
  | FillIssueTypesAction
  | FillIssueStatusesAction
  | AddIssuesAction
  | ClearIssuesAction
  | SetIssuesFetchingAction
  | SetRefetchIssuesIndicatorAction
  | SetIssuesTotalCountAction
  | SelectIssueAction
  | SetTrackingIssueAction
  | SetIssuesSearchValueAction
  | SetIssuesFilterAction;

