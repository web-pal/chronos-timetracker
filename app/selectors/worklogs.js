import { createSelector } from 'reselect';
import moment from 'moment';

import { getIssuesMap } from '../selectors/issues';

function dateComparator(a, b) {
  return moment(a.get('created')).isAfter(b.get('created')) ? 1 : -1;
}

export const getWorklogsMap = ({ worklogs }) => worklogs.byId;
export const getWorklogsIds = ({ worklogs }) => worklogs.allIds;

export const getRecentWorklogIds = ({ worklogs }) => worklogs.meta.get('recent');

export const getRecentWorklogs = createSelector(
  [getRecentWorklogIds, getWorklogsMap],
  (ids, map) => ids.map(id => map.get(id)).sort(dateComparator),
);

export const getRecentWorklogsWithIssues = createSelector(
  [getRecentWorklogs, getIssuesMap],
  (wMap, iMap) => wMap.map(w => w.set('issue', iMap.get(w.get('issueId')))),
);

export const getRecentWorklogsGroupedByDate = createSelector(
  getRecentWorklogsWithIssues,
  map => map.groupBy(
    w => moment(w.get('updated')).startOf('day'),
  )
  .reverse()
  .map(g => ({ day: moment(g.first().get('updated')).startOf('day').format(), worklogs: g }))
  .toList(),
);
