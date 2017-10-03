import { types } from 'actions';
import type { Id } from './index';

// TODO type for screenshot
export type Screenshot = any;

// TODO type for issue
export type Issue = any;

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
  +meta: IssuesMeta,
|}

//
export type FetchIssuesRequestAction =
  {| type: types.FETCH_ISSUES_REQUEST, payload: { startIndex: ?number, stopIndex: ?number }|}

export type FetchIssuesRequest = {
  (startIndex: ?number, stopIndex: ?number): FetchIssuesRequestAction
}

//
export type FillIssuesAction =
  {| type: types.FILL_ISSUES, payload: { ids: Array<Id>, map: IssuesMap }|};

export type FillIssues = {
  (payload: { ids: Array<Id>, map: IssuesMap }): FillIssuesAction
}

//
export type ClearIssuesAction =
  {| type: types.CLEAR_ISSUES |};

export type ClearIssues = {
  (): ClearIssuesAction
}

//
export type SetIssuesFetchingAction =
  {| type: types.SET_ISSUES_FETCHING, +payload: boolean |};

export type SetIssuesFetching = {
  (payload: boolean): SetIssuesFetchingAction
}

//
export type SetIssuesTotalCountAction =
  {| type: types.SET_ISSUES_TOTAL_COUNT, +payload: number |};

export type SetIssuesTotalCount = {
  (payload: number): SetIssuesTotalCountAction
}

//
export type SelectIssueAction =
  {| type: types.SELECT_ISSUE, +payload: Id |};

export type SelectIssue = {
  (payload: Id): SelectIssueAction,
}

//
export type SetTrackingIssueAction =
  {| type: types.SET_TRACKING_ISSUE, +payload: Id |};

export type SetTrackingIssue = {
  (payload: Id): SetTrackingIssueAction,
}

//
export type SetIssuesSearchValueAction =
  {| type: types.SET_ISSUES_SEARCH_VALUE, +payload: string |};

export type SetIssuesSearchValue = {
  (payload: string): SetIssuesSearchValueAction
}

export type IssuesAction =
  FetchIssuesRequestAction
  | FillIssuesAction
  | ClearIssuesAction
  | SetIssuesFetchingAction
  | SetIssuesTotalCountAction
  | SelectIssueAction
  | SetTrackingIssueAction
  | SetIssuesSearchValueAction;
