// @flow
import { createSelector } from 'reselect';
import moment from 'moment';
import groupBy from 'lodash.groupby';

import type {
  IssuesState,
  IssueFilters,
  IssuesMap,
  IssueTypesMap,
  IssueStatusesMap,
  Issue,
  Id,
} from '../types';

export const getIssuesIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.allIds;

export const getIssuesMap =
  ({ issues }: { issues: IssuesState }): IssuesMap => issues.byId;

export const getAllIssues = createSelector(
  [getIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getIssueTypesIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.issueTypesIds;

export const getIssueTypesMap =
  ({ issues }: { issues: IssuesState }): IssueTypesMap => issues.issueTypesById;

export const getIssueStatusesIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.issueStatusesIds;

export const getIssueStatusesMap =
  ({ issues }: { issues: IssuesState }): IssueStatusesMap => issues.issueStatusesById;

export const getFoundIssueIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.foundIds;

export const getIssueTypes = createSelector(
  [getIssueTypesIds, getIssueTypesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getIssueStatuses = createSelector(
  [getIssueStatusesIds, getIssueStatusesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getSidebarIssues = createSelector(
  [getAllIssues, getFoundIssueIds, getIssuesMap],
  (allItems, foundIds, map) => {
    if (foundIds.length > 0) {
      return foundIds.map(id => map[id]);
    }
    return allItems;
  },
);

export const getRecentIssueIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.recentIds;

export const getRecentIssuesTotalCount = createSelector(
  [getRecentIssueIds],
  (ids) => ids.length,
);

export const getRecentIssues = createSelector(
  [getRecentIssueIds, getIssuesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getRecentItems = createSelector(
  [getRecentIssues, getIssuesMap],
  (map, iMap) => {
    const recentWorklogs =
      map
        .reduce((worklogs, value) => worklogs.concat(value.fields.worklog.worklogs), [])
        .sort((a, b) => moment(b.created).isSameOrAfter(moment(a.created)));
    const _recentWorklogs = recentWorklogs.map(w => {
      const _w = w;
      _w.issue = iMap[_w.issueId];
      return _w;
    });
    const grouped = groupBy(_recentWorklogs, (value) => moment(value.created).startOf('day'));
    return grouped;
  },
);

export const getIssuesFetching =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.fetching;

export const getIssuesSearching =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.searching;

export const getIssuesTotalCount =
  ({ issues }: { issues: IssuesState }): number => (issues.meta.totalCount > 0
    ? issues.meta.totalCount
    : 0);

export const getSelectedIssueId =
  ({ issues }: { issues: IssuesState }): Id | null => issues.meta.selectedIssueId;

export const getTrackingIssueId =
  ({ issues }: { issues: IssuesState }): Id | null => issues.meta.trackingIssueId;

export const getIssuesSearchValue =
  ({ issues }: { issues: IssuesState }): string => issues.meta.searchValue;

export const getSelectedIssue =
  ({ issues }: { issues: IssuesState }): Issue | null => issues.meta.selectedIssue;

export const getTrackingIssue =
  ({ issues }: { issues: IssuesState }): Issue | null => issues.meta.trackingIssue;

export const getIssueFilters =
  ({ issues }: { issues: IssuesState }): IssueFilters => issues.meta.filters;

export const getFiltersApplied = createSelector(
  [getIssueFilters],
  (filters) => (!!filters.type.length || !!filters.status.length || !!filters.assignee.length),
);
