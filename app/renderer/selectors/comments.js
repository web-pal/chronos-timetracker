// @flow
import {
  createSelector,
} from 'reselect';
import moment from 'moment';

import type {
  IssueComment,
  IssuesCommentsFilter,
} from 'types';

import {
  getResourceMappedList,
} from './resources';
import {
  getUiState,
} from './ui';

export const getIssuesCommentsFilter = createSelector(
  [
    getUiState('issuesSourceType'),
    getUiState('issuesSourceId'),
    getUiState('issuesSprintId'),
    getUiState('issuesCommentsFilters'),
  ],
  (issuesSourceType, issuesSourceId, issuesSprintId, issuesCommentsFilters) => {
    const filterKey = `${issuesSourceType}_${issuesSourceId}_${issuesSprintId}`;
    return issuesCommentsFilters[filterKey] ||
      {
        orderBy: { label: 'Created', value: 'created' },
        orderType: 'DESC',
      };
  }
)

const commentSorter = (ascending) => (a, b) => {
  if (moment(a.created).isAfter(moment(b.created))) return ascending ? 1 : -1;
  if (moment(a.created).isBefore(moment(b.created))) return ascending ? -1 : 1;
  return 0;
};

export const getSortedIssueComments = (selectedIssueId: string) =>
  createSelector(
    [
      getIssuesCommentsFilter,
      getResourceMappedList('issuesComments', `issue_${selectedIssueId}`)
    ],
    (filter: IssuesCommentsFilter, issueComments: Array<IssueComment>) => {
      return issueComments.sort(commentSorter(filter.orderType === 'ASC'));
    }
  );