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
  getUiState,
} from './ui';
import {
  getUserData,
  getSelfKey,
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

const worklogSorter = (a, b) => {
  if (moment(a.started).isAfter(moment(b.started))) return -1;
  if (moment(a.started).isBefore(moment(b.started))) return 1;
  return 0;
};

export const getRecentIssues = createSelector(
  [
    getResourceMappedList('issues', 'recentIssues'),
    getResourceMap('issues'),
    getResourceMap('worklogs'),
    getUserData,
  ],
  (
    issues,
    issuesMap,
    worklogsMap,
    self,
  ) => {
    const selfKey = self ? self.key : '';
    const worklogsIds =
      issues
        .reduce(
          (worklogs, issue) => worklogs.concat(
            issue.fields.worklogs,
          ),
          [],
        );
    const worklogs = worklogsIds.map(id => ({
      ...worklogsMap[id],
      issue: issuesMap[worklogsMap[id].issueId],
    }));
    const recentWorklogsFiltered =
      filter(
        worklogs,
        w =>
          moment(w.started).isSameOrAfter(moment().subtract(4, 'weeks')) &&
          w.author.key === selfKey,
      ).sort(worklogSorter);
    const grouped =
      groupBy(
        recentWorklogsFiltered,
        value => moment(value.started).startOf('day').format(),
      );
    return grouped;
  },
);

export const getEditWorklog = createSelector(
  [
    getResourceMap('worklogs'),
    getUiState('editWorklogId'),
  ],
  (
    worklogsMap,
    worklogId,
  ) => (worklogsMap[worklogId] ? worklogsMap[worklogId] : null),
);

export const getSelectedIssue = createSelector(
  [
    getResourceMap('issues'),
    getUiState('selectedIssueId'),
  ],
  (
    issuesMap,
    issueId,
  ) => (issuesMap[issueId] ? issuesMap[issueId] : null),
);

export const getSelectedIssueWorklogs = createSelector(
  [
    getSelectedIssue,
    getResourceMap('worklogs'),
  ],
  (
    issue,
    worklogsMap,
  ) => (issue ? issue.fields.worklogs.map(id => worklogsMap[id]).sort(worklogSorter) : []),
);

export const getIssueWorklogs = (issueId: number | string) => state => {
  const worklogsMap = getResourceMap('worklogs')(state);
  const issuesMap = getResourceMap('issues')(state);
  const issue = issuesMap[issueId];
  if (issue) {
    return issue.fields.worklogs.map(id => worklogsMap[id]).sort(worklogSorter);
  }
  return [];
};

export const getTrackingIssue = createSelector(
  [
    getResourceMap('issues'),
    getUiState('trackingIssueId'),
  ],
  (
    issuesMap,
    issueId,
  ) => (issuesMap[issueId] ? issuesMap[issueId] : null),
);


export const getFieldIdByName = (fieldName: string) => ({ issuesFields }) => {
  const fields = issuesFields.lists.allFields.map(id => issuesFields.resources[id]);
  const field = fields.find(f => f.name === fieldName);
  if (!field) {
    return null;
  }
  return field.id;
};

export const getSelectedIssueEpic = createSelector(
  [
    getResourceMap('issues'),
    getResourceMappedList('issues', 'epicIssues'),
    getResourceMap('issuesFields'),
    getUiState('selectedIssueId'),
    getFieldIdByName('Epic Link'),
    getFieldIdByName('Epic Name'),
    getFieldIdByName('Epic Color'),
  ],
  (
    issuesMap,
    epics,
    fieldsMap,
    issueId,
    epicLinkFieldId,
    epicNameFieldId,
    epicColorFieldId,
  ) => {
    const issue = issuesMap[issueId];
    const epicKey = issue.fields[epicLinkFieldId];
    if (epicKey) {
      const epic = epics.find(e => e.key === epicKey);
      if (epic) {
        return {
          ...epic,
          color: epic.fields[epicColorFieldId],
          name: epic.fields[epicNameFieldId],
        };
      }
    }
    return null;
  },
);


export const getSelectedIssueReport = createSelector(
  [
    getSelectedIssue,
    getSelectedIssueWorklogs,
    getSelfKey,
  ],
  (
    issue,
    worklogs,
    selfKey,
  ) => {
    const timespent = issue.fields.timespent || 0;
    const remaining = issue.fields.timeestimate || 0;
    const estimate = remaining - timespent < 0 ? 0 : remaining - timespent;

    const loggedTotal = worklogs.reduce((v, w) => v + w.timeSpentSeconds, 0);
    const yourWorklogs = worklogs.filter(w => w.author.key === selfKey);
    const youLoggedTotal = yourWorklogs.reduce((v, w) => v + w.timeSpentSeconds, 0);
    const yourWorklogsToday = yourWorklogs.filter(w => moment(w.updated).isSameOrAfter(moment().startOf('day')));
    const youLoggedToday = yourWorklogsToday.reduce((v, w) => v + w.timeSpentSeconds, 0);

    return {
      timespent,
      remaining,
      estimate,
      loggedTotal,
      yourWorklogs,
      youLoggedTotal,
      yourWorklogsToday,
      youLoggedToday,
    };
  },
);
