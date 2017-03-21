import { createSelector } from 'reselect';
import { Map } from 'immutable';

export const getIssuesMap = ({ issues }) => issues.byId;
export const getIssuesIds = ({ issues }) => issues.allIds;

export const getRecentIssuesIds = ({ issues }) => issues.meta.recentIssuesIds;
export const getSearchResultIssuesIds = ({ issues }) => issues.meta.searchResultsIds;

export const getSelectedIssueId = ({ issues }) => issues.meta.selectedIssueId;
export const getTrackingIssueId = ({ issues }) => issues.meta.trackingIssueId;

export const getIssues = createSelector(
  [getIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id)),
);

export const getRecentIssues = createSelector(
  [getRecentIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id)),
);

export const getSearchResultIssues = createSelector(
  [getSearchResultIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id)).toList(),
);

export const getAllIssues = createSelector(
  [getSearchResultIssuesIds, getIssuesIds, getIssuesMap],
  (searchIds, ids, map) => ids.map(id => map.get(id)).toList(),
);

export const getTrackingIssue = createSelector(
  [getTrackingIssueId, getIssuesMap],
  (id, map) => map.get(id) || new Map(),
);

export const getSelectedIssue = createSelector(
  [getSelectedIssueId, getIssuesMap],
  (id, map) => map.get(id) || new Map(),
);
