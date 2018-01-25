// @flow
import { createSelector } from 'reselect';
import moment from 'moment';
import groupBy from 'lodash.groupby';
import filter from 'lodash.filter';

import { getUserData } from './profile';

import type {
  IssuesState,
  IssueFilters,
  IssuesMap,
  IssueTypesMap,
  IssueStatusesMap,
  Issue,
  IssueTransition,
  IssueComment,
  Id,
} from '../types';

export const getIssuesIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.allIds;

export const getIssuesMap =
  ({ issues }: { issues: IssuesState }): IssuesMap => issues.byId;

export const getEpicsIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.epicsIds;

export const getEpicsMap =
  ({ issues }: { issues: IssuesState }): IssuesMap => issues.epicsById;

export const getAllIssues = createSelector(
  [getIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getIssuesIndexedIds =
  ({ issues }: { issues: IssuesState }): {[number]: Id} => issues.indexedIds;

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
  [getIssuesIndexedIds, getFoundIssueIds, getIssuesMap],
  (indexedIds, foundIds, map) => {
    if (foundIds.length > 0) {
      return foundIds.map(id => map[id]);
    }
    return Object.keys(indexedIds).reduce((acc, index) => {
      const id = indexedIds[index].toString();
      acc[index] = map[id];
      return acc;
    }, {});
  },
);

export const getRecentIssueIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.recentIds;

export const getRecentIssuesTotalCount = createSelector(
  [getRecentIssueIds],
  ids => ids.length,
);

export const getRecentIssues = createSelector(
  [getRecentIssueIds, getIssuesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getRecentItems = createSelector(
  [getRecentIssues, getIssuesMap, getUserData],
  (map, iMap, self) => {
    const selfKey = self ? self.key : '';
    const recentWorklogs =
      map
        .reduce(
          (worklogs, value) => worklogs.concat(value.fields.worklog.worklogs),
          [],
        ).map(w => ({ ...w, issue: iMap[w.issueId] }));
    const recentWorklogsFiltered =
      filter(
        recentWorklogs,
        w =>
          moment(w.started).isSameOrAfter(moment().subtract(4, 'weeks')) &&
          w.author.key === selfKey,
      );
    const grouped =
      groupBy(recentWorklogsFiltered, value => moment(value.started).startOf('day').format());
    return grouped;
  },
);

export const getIssuesFetching =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.fetching;

export const getRecentIssuesFetching =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.recentFetching;

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
  filters => (!!filters.type.length || !!filters.status.length || !!filters.assignee.length),
);

export const getAvailableTransitions =
  ({ issues }: { issues: IssuesState }): Array<IssueTransition> => issues.meta.availableTransitions;

export const getAvailableTransitionsFetching =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.availableTransitionsFetching;

export const getComments =
  ({ issues }: { issues: IssuesState }): Array<IssueComment> => issues.meta.comments;

export const getCommentsFetching =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.commentsFetching;

export const getCommentsAdding =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.commentsAdding;

export const getFieldIdByName =
  ({ issues }: { issues: IssuesState }, fieldName: string): string | null => {
    const { fields } = issues.meta;
    if (fields) {
      const found = fields.find(f => f.name === fieldName);
      if (found) {
        return found.id;
      }
      return null;
    }
    return null;
  };

export const getIssueEpic = createSelector(
  [
    getSelectedIssue,
    getEpicsMap,
    state => getFieldIdByName(state, 'Epic Link'),
    state => getFieldIdByName(state, 'Epic Name'),
    state => getFieldIdByName(state, 'Epic Color'),
  ],
  (issue, map, epicLinkFieldId, epicNameFieldId, epicColorFieldId) => {
    if (Object.keys(map).length && issue) {
      const epic = map[issue.fields[epicLinkFieldId]];
      if (epic) {
        epic.fields.epicColor = epic.fields[epicColorFieldId];
        epic.fields.epicName = epic.fields[epicNameFieldId];
        return epic;
      }
      return null;
    }
    return null;
  },
);
