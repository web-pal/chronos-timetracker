import { createSelector } from 'reselect';

export const getIssuesMap = ({ issues }) => issues.byId;
export const getIssuesIds = ({ issues }) => issues.allIds;

export const getRecentIssuesMap = ({ issues }) => issues.recentById;

export const getIssuesFilter = ({ filter }) => filter.value;
export const getResolveFilter = ({ filter }) => filter.resolveValue;

export const getSearchResultIssuesIds = ({ issues }) => issues.meta.get('searchResults');

export const getTrackingIssueId = ({ issues }) => issues.meta.get('tracking');
export const getTrackingIssue = ({ issues }) => issues.meta.get('trackingIssue');

export const getSelectedIssueId = ({ issues }) => issues.meta.get('selected');

export const getIssues = createSelector(
  [getIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id))
);

export const getSearchResultIssues = createSelector(
  [getSearchResultIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id))
);

export const getSelectedIssue = createSelector(
  [getSelectedIssueId, getIssuesMap, getRecentIssuesMap],
  (id, map, rMap) => map.get(id) || rMap.get(id) || new Map()
);
