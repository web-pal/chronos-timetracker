// @flow
import {
  createSelector,
} from 'reselect';
import moment from 'moment';
import filter from 'lodash.filter';
import groupBy from 'lodash.groupby';

import {
  getResourceIds,
  getResourceMap,
  getResourceMappedList,
} from './resources';
import {
  getUserData,
} from './profile';


export const getSidebarIssues2 = createSelector(
  [
    getResourceIds('issues', 'filterIssuesIndexed'),
    getResourceMap('issues'),
  ],
  (
    indexedIds,
    map,
  ) =>
    Object.keys(indexedIds).reduce((acc, index) => {
      const id = indexedIds[index].toString();
      acc[index] = map[id];
      return acc;
    }, {}),
);

const daySorter = (a, b) => {
  if (moment(a).isAfter(moment(b))) return -1;
  if (moment(a).isBefore(moment(b))) return 1;
  return 0;
};

const worklogSorter = (a, b) => {
  if (moment(a.created).isAfter(moment(b.created))) return -1;
  if (moment(a.created).isBefore(moment(b.created))) return 1;
  return 0;
};

export const getRecentIssues = createSelector(
  [
    getResourceMappedList('issues', 'recentIssues'),
    getResourceMap('issues'),
    getUserData,
  ],
  (
    issues,
    issuesMap,
    self,
  ) => {
    const selfKey = self ? self.key : '';
    const recentWorklogs =
      issues
        .reduce(
          (worklogs, issue) => worklogs.concat(
            issue.fields.worklog.worklogs.sort(worklogSorter),
          ),
          [],
        ).map(w => ({ ...w, issue: issuesMap[w.issueId] }));
    const recentWorklogsFiltered =
      filter(
        recentWorklogs,
        w =>
          moment(w.started).isSameOrAfter(moment().subtract(4, 'weeks')) &&
          w.author.key === selfKey,
      ).sort(daySorter);
    const grouped =
      groupBy(
        recentWorklogsFiltered,
        value => moment(value.started).startOf('day').format(),
      );
    return grouped;
  },
);

