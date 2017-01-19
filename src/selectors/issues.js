import { createSelector } from 'reselect';
import { getWorklogsMap } from './worklogs';

function worklogDateComparator(a, b) {
  const aLastWorklogDate = a.getIn(['worklogs', a.get('worklogs').size - 1, 'started']);
  const bLastWorklogDate = b.getIn(['worklogs', b.get('worklogs').size - 1, 'started']);
  return aLastWorklogDate < bLastWorklogDate;
}

export const getIssuesMap = ({ issues }) => issues.byId;
export const getIssuesIds = ({ issues }) => issues.allIds;

export const getIssuesFilter = ({ context }) => context.filterValue;
export const getResolveFilter = ({ context }) => context.resolveFilter;

export const getTrackingIssueId = ({ tracker }) => tracker.trackingIssue;

export const getSelectedIssueId = ({ issues }) => issues.meta.get('selected');

export const getFilteredIssues = createSelector(
  [getIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id))
);

export const getIssues = createSelector(
  [getIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id))
);

export const getRecentIssues = createSelector(
  [getIssues],
  (map) => map.filter(issue => issue && issue.get('recent'))
);

export const getRecentIssuesWithWorklogs = createSelector(
  [getRecentIssues, getWorklogsMap],
  (map, wMap) => map.map(issue => {
    const worklogs = issue.getIn(['fields', 'worklog', 'worklogs']).map(w => wMap.get(w));
    return issue.set('worklogs', worklogs);
  }).sort((a, b) => worklogDateComparator(a, b))
);

export const getTrackingIssue = createSelector(
  [getIssuesMap, getTrackingIssueId],
  (issues, id) => issues.find(issue => issue.get('id') === id),
);

export const getSelectedIssue = createSelector(
  [getSelectedIssueId, getIssuesMap],
  (id, map) => map.get(id)
);
