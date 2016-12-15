import { createSelector } from 'reselect';

const getIssues = state => state.context.issues;

const getIssuesFilter = state => state.context.filterValue;
const getResolveFilter = state => state.context.resolveFilter;

const getTrackingIssueId = state => state.tracker.trackingIssue;

export const getFilteredIssues = createSelector(
  [getIssues, getIssuesFilter, getResolveFilter],
  (issues, filter, resolveFilter) => issues.map(issue =>
    issue.get('key').toLowerCase().includes(filter.toLowerCase()) ||
    issue.getIn(['fields', 'summary']).toLowerCase().includes(filter.toLowerCase())
    ? (resolveFilter // please don't blame me for this nasty nested hell
      ? ( issue.getIn(['fields', 'resolution']) === null
        ? issue
        : false )
      : issue)
    : false,
  ),
);

export const getTrackingIssue = createSelector(
  [getIssues, getTrackingIssueId],
  (issues, id) => issues.find(issue => issue.get('id') === id),
);

