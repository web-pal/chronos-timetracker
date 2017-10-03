// @flow
import { createSelector } from 'reselect';
import type { IssuesState, IssuesMap, Id } from '../types';

export const getIssuesIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.allIds;

export const getIssuesMap =
  ({ issues }: { issues: IssuesState }): IssuesMap => issues.byId;

export const getAllIssues = createSelector(
  [getIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getRecentIssueIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.recentIds;

export const getRecentIssues = createSelector(
  [getRecentIssueIds, getIssuesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getIssuesFetching =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.fetching;

export const getIssuesTotalCount =
  ({ issues }: { issues: IssuesState }): number => issues.meta.totalCount;

export const getSelectedIssueId =
  ({ issues }: { issues: IssuesState }): Id | null => issues.meta.selectedIssueId;

export const getTrackingIssueId =
  ({ issues }: { issues: IssuesState }): Id | null => issues.meta.trackingIssueId;
