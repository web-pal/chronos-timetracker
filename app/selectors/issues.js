import { createSelector } from 'reselect';
import { Map } from 'immutable';

export const getIssuesMap = ({ issues }) => issues.byId;
export const getIssuesIds = ({ issues }) => issues.allIds;

export const getIssuesAllTypesMap = ({ issues }) => issues.meta.issuesAlltypesMap;
export const getIssuesAllTypesIds = ({ issues }) => issues.meta.issuesTypesIds;
export const getSubIssuesAllTypesIds = ({ issues }) => issues.meta.subIssuesTypesIds;
export const getSubIssuesAllTypesFilter = ({ issues }) => issues.meta.issueFilterOfFilters_Type;

export const getIssuesAllStatusesMap = ({ issues }) => issues.meta.issueStatuses;
export const getIssuesAllStatusesIds = ({ issues }) => issues.meta.issueStatusesIds;
export const getSubIssuesAllStatusCategories = ({ issues }) => issues.meta.issueStatusCategories;
export const getIssuesAllStatusesFilter = ({ issues }) => issues.meta.issueFilterOfFilters_Status;

export const getIssuesAllAssigneeFilter = ({ issues }) => issues.meta.issueFilterOfFilters_Assignee;

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
  [getSearchResultIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map.get(id)).toList(),
);

export const getAllIssues = createSelector(
  [getSearchResultIssuesIds, getIssuesIds, getIssuesMap],
  (searchIds, ids, map) => ids.map(id => map.get(id)).toList(),
);

export const getAllIssuesStatuses = createSelector(
  [getIssuesAllStatusesIds, getSubIssuesAllStatusCategories,
    getIssuesAllStatusesMap, getIssuesAllStatusesFilter],
  (ids, categories, map, filter) =>
    ids.filter(id => (filter ? map[id].name.includes(filter) : true))
        .map(id => ({ ...map[id], style: categories[map[id].statusCategory] })),
);

export const getAllIssuesTypes = createSelector(
  [getIssuesAllTypesIds, getIssuesAllTypesMap, getSubIssuesAllTypesFilter],
  (ids, map, filter) => ids.filter(id => (filter ? map[id].name.includes(filter) : true))
                    .map(id => map[id]),
);

export const getAllSubIssuesTypes = createSelector(
  [getSubIssuesAllTypesIds, getIssuesAllTypesMap, getSubIssuesAllTypesFilter],
  (ids, map, filter) => ids.filter(id => (filter ? map[id].name.includes(filter) : true))
                    .map(id => map[id]),
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
