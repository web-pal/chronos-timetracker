import { createSelector } from 'reselect';
import moment from 'moment';

import { getRecentIssuesMap } from '../selectors/issues';

export const getWorklogsMap = ({ worklogs }) => worklogs.byId;
export const getWorklogsIds = ({ worklogs }) => worklogs.allIds;

export const getRecentWorklogIds = ({ worklogs }) => worklogs.meta.get('recent');

export const getRecentWorklogs = createSelector(
  [getRecentWorklogIds, getWorklogsMap],
  (ids, map) => ids.map(id => map.get(id))
);

export const getRecentWorklogsWithIssues = createSelector(
  [getRecentWorklogs, getRecentIssuesMap],
  (wMap, iMap) => wMap.map(w => w.set('issue', iMap.get(w.get('issueId'))))
);

export const getRecentWorklogsGroupedByDate = createSelector(
  [getRecentWorklogsWithIssues],
  (map) => map.groupBy(w => moment(w.get('updated')).startOf('day')).reverse()
);
