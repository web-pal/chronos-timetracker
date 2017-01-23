import { createSelector } from 'reselect';

export const getIssuesMap = ({ issues }) => issues.byId;
export const getIssuesIds = ({ issues }) => issues.allIds;

export const getIssuesFilter = ({ filter }) => filter.value;
export const getResolveFilter = ({ filter }) => filter.resolveValue;

export const getSearchResultIssuesIds = ({ issues }) => issues.meta.get('searchResults');

export const getTrackingIssueId = ({ tracker }) => tracker.trackingIssue;

export const getSelectedIssueId = ({ issues }) => issues.meta.get('selected');

export const getIssues = createSelector(
  [getIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id))
);

export const getSearchResultIssues = createSelector(
  [getSearchResultIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id))
);

export const getTrackingIssue = createSelector(
  [getIssuesMap, getTrackingIssueId],
  (issues, id) => issues.find(issue => issue.get('id') === id),
);

export const getSelectedIssue = createSelector(
  [getSelectedIssueId, getIssuesMap],
  (id, map) => map.get(id) || new Immutable.Map({})
);
