import { createSelector } from 'reselect';
import { Map } from 'immutable';
import moment from 'moment';

export const getIssuesMap = ({ issues }) => issues.byId;
export const getIssuesIds = ({ issues }) => issues.allIds;

export const getIssuesAllTypesMap = ({ issues }) => issues.meta.issuesCriteriaOptionsType;
export const getIssuesAllTypesIds = ({ issues }) => issues.meta.issuesTypesIds;
export const getSubIssuesAllTypesIds = ({ issues }) => issues.meta.subIssuesTypesIds;
export const getSubIssuesAllTypesFilter = ({ issues }) =>
  issues.meta.issueFilterOfFiltersType.toLowerCase();
export const getFrilteredTypesIds = ({ issues }) => issues.meta.issueCurrentCriteriaFilterType;

export const getIssuesAllStatusesMap = ({ issues }) => issues.meta.issuesCriteriaOptionsStatus;
export const getIssuesAllStatusesIds = ({ issues }) => issues.meta.issueStatusesIds;
export const getSubIssuesAllStatusCategories = ({ issues }) => issues.meta.issueStatusCategories;
export const getIssuesAllStatusesFilter = ({ issues }) =>
  issues.meta.issueFilterOfFiltersStatus.toLowerCase();
export const getFrilteredStatusIds = ({ issues }) => issues.meta.issueCurrentCriteriaFilterStatus;

export const getRecentIssuesIds = ({ issues }) => issues.meta.recentIssuesIds;
export const getSearchResultIssuesIds = ({ issues }) => issues.meta.searchResultsIds;

export const getSelectedIssueId = ({ issues }) => issues.meta.selectedIssueId;
export const getTrackingIssueId = ({ issues }) => issues.meta.trackingIssueId;

const getWorklogsMap = ({ worklogs }) => worklogs.byId;
const getSelfKey = ({ profile }) => profile.userData.get('key');


export const getIssues = createSelector(
  [getIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id)),
);

export const getRecentIssues = createSelector(
  [getRecentIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id)),
);

export const getSearchResultIssues = createSelector(
  [
    getSearchResultIssuesIds,
    getIssuesMap,
  ],
  (ids, map) =>
    ids.map(id => map.get(id)).toList(),
);

export const getAllIssues = createSelector(
  [
    getSearchResultIssuesIds,
    getIssuesIds,
    getIssuesMap,
  ],
  (searchIds, ids, map) =>
    ids.map(id => map.get(id)).toList(),
  );

export const getAllIssuesStatuses = createSelector(
  [getIssuesAllStatusesIds, getSubIssuesAllStatusCategories,
    getIssuesAllStatusesMap, getIssuesAllStatusesFilter],
  (ids, categories, map, filter) =>
  ids.filter(id => (filter ? map.get(id).get('name').toLowerCase().includes(filter) : true))
        .map(id => map.get(id).set('style', categories.get(map.get(id).statusCategory))),
);

export const getAllIssuesTypes = createSelector(
  [getIssuesAllTypesIds, getIssuesAllTypesMap, getSubIssuesAllTypesFilter],
  (ids, map, filter) =>
  ids.filter(id => (filter ? map.get(id).get('name').toLowerCase().includes(filter) : true))
    .map(id => map.get(id)),
);

export const getAllSubIssuesTypes = createSelector(
  [getSubIssuesAllTypesIds, getIssuesAllTypesMap, getSubIssuesAllTypesFilter],
  (ids, map, filter) =>
  ids.filter(id => (filter ? map.get(id).get('name').toLowerCase().includes(filter) : true))
    .map(id => map.get(id)),
);

export const getTrackingIssue = createSelector(
  [getTrackingIssueId, getIssuesMap],
  (id, map) => map.get(id) || new Map(),
);

export const getSelectedIssue = createSelector(
  [getSelectedIssueId, getIssuesMap],
  (id, map) => map.get(id) || new Map(),
);

export const getIssueLoggedByUser = createSelector(
  [getSelectedIssue, getWorklogsMap, getSelfKey],
  (issue, worklogs, selfKey) => {
    const worklogsIds = issue.getIn(['fields', 'worklog', 'worklogs']) || Immutable.List([]);
    return worklogsIds
      .map(w => worklogs.get(w))
      .filter(worklog => worklog.get('issueId') === issue.get('id') && worklog.getIn(['author', 'key']) === selfKey)
      .reduce((prevValue, i) => i.get('timeSpentSeconds') + prevValue, 0);
  },
);

export const getIssueLoggedByUserToday = createSelector(
  [getSelectedIssue, getWorklogsMap, getSelfKey],
  (issue, worklogs, selfKey) => {
    const worklogsIds = issue.getIn(['fields', 'worklog', 'worklogs']) || Immutable.List([]);
    const today = new Date();
    return worklogsIds
      .map(w => worklogs.get(w))
      .filter(worklog => worklog.get('issueId') === issue.get('id') && worklog.getIn(['author', 'key']) === selfKey)
      .filter(w => moment(w.get('created')).isSame(today, 'day'))
      .reduce((prevValue, i) => i.get('timeSpentSeconds') + prevValue, 0);
  },
);

export const getIssueLoggedToday = createSelector(
  [getSelectedIssue, getWorklogsMap],
  (issue, worklogs) => {
    const worklogsIds = issue.getIn(['fields', 'worklog', 'worklogs']) || Immutable.List([]);
    const today = new Date();
    return worklogsIds
      .map(w => worklogs.get(w))
      .filter(worklog => worklog.get('issueId') === issue.get('id'))
      .filter(w => moment(w.get('created')).isSame(today, 'day'))
      .reduce((prevValue, i) => i.get('timeSpentSeconds') + prevValue, 0);
  },
);
