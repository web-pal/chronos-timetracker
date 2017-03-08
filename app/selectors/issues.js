import { createSelector } from 'reselect';
import { Map } from 'immutable';

export const getIssuesMap = ({ issues }) => issues.byId;
export const getIssuesIds = ({ issues }) => issues.allIds;

export const getRecentIssuesMap = ({ issues }) => issues.recentById;

export const getIssuesFilter = ({ filter }) => filter.value;
export const getResolveFilter = ({ filter }) => filter.resolveValue;

export const getSearchResultIssuesIds = ({ issues }) => issues.meta.searchResults;

export const getTrackingIssueId = ({ issues }) => issues.meta.tracking;

export const getSelectedIssueId = ({ issues }) => issues.meta.selected;

export const getIssues = createSelector(
  [getIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id))
);

export const getSearchResultIssues = createSelector(
  [getSearchResultIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id))
);

export const getTrackingIssue = createSelector(
  [getTrackingIssueId, getIssuesMap, getRecentIssuesMap],
  (id, map, rMap) => map.get(id) || rMap.get(id) || new Map()
);

export const getSelectedIssue = createSelector(
  [getSelectedIssueId, getIssuesMap, getRecentIssuesMap],
  (id, map, rMap) => map.get(id) || rMap.get(id) || new Map()
);
