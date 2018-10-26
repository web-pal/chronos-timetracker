// @flow
import {
  createSelector,
} from 'reselect';
import moment from 'moment';
import * as R from 'ramda';

import type {
  Id,
  State,
  IndexedIds,
  IssuesResources,
  Issue,
  WorklogsResources,
  Worklog,
  IssuesFieldsState,
  IssuesFieldsResources,
  ProjectsResources,
  Project,
  BoardsResources,
  Board,
  FiltersResources,
  JIRAFilter,
} from 'types';

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


export const getSidebarIssues = createSelector(
  [
    getResourceIds('issues', 'filterIssuesIndexed'),
    getResourceMap('issues'),
  ],
  (
    indexedIds: IndexedIds,
    map: IssuesResources,
  ) =>
    Object.keys(indexedIds).reduce((acc, index) => {
      const id = indexedIds[index].toString();
      acc[index] = id === 'pending' ? id : map[id];
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
    issues: Array<Issue>,
    issuesMap: IssuesResources,
    worklogsMap: WorklogsResources,
    self: any,
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
      worklogs.filter(
        w =>
          moment(w.started).isSameOrAfter(moment().subtract(4, 'weeks')) &&
          R.path(['author', 'key'], w) === selfKey
      ).sort(worklogSorter);
    const grouped =
      R.groupBy(
        value => moment(value.started).startOf('day').format(),
        recentWorklogsFiltered,
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
    worklogsMap: WorklogsResources,
    worklogId: Id,
  ) => (worklogsMap[worklogId] ? worklogsMap[worklogId] : null),
);

export const getSelectedIssue = createSelector(
  [
    getResourceMap('issues'),
    getUiState('selectedIssueId'),
  ],
  (
    issuesMap: IssuesResources,
    issueId: Id,
  ) => (issuesMap[issueId] ? issuesMap[issueId] : null),
);

export const getSelectedIssueWorklogs = createSelector(
  [
    // $FlowFixMe
    getSelectedIssue,
    getResourceMap('worklogs'),
  ],
  (
    issue: Issue,
    worklogsMap: WorklogsResources,
  ) => (
    issue ?
      issue.fields.worklogs.map(id => worklogsMap[id]).sort(worklogSorter) :
      []
  ),
);

export const getIssueWorklogs = (issueId: Id) => (state: State) => {
  const worklogsMap = getResourceMap('worklogs')(state);
  const issuesMap = getResourceMap('issues')(state);
  const issue: Issue = issuesMap[issueId];
  if (issue) {
    return (
      issue.fields.worklogs
        .map(id => worklogsMap[id])
        .sort(worklogSorter)
    );
  }
  return [];
};

export const getTrackingIssue = createSelector(
  [
    getResourceMap('issues'),
    getUiState('trackingIssueId'),
  ],
  (
    issuesMap: IssuesResources,
    issueId: Id,
  ) => (issuesMap[issueId] ? issuesMap[issueId] : null),
);

export const getTrackingIssueWorklogs = createSelector(
  [
    // $FlowFixMe
    getTrackingIssue,
    getResourceMap('worklogs'),
  ],
  (
    issue: Issue,
    worklogsMap: WorklogsResources,
  ) => (
    issue ?
      issue.fields.worklogs.map(id => worklogsMap[id]).sort(worklogSorter) :
      []
  ),
);


export const getFieldIdByName =
  (fieldName: string) =>
    ({
      issuesFields,
    }: {
      issuesFields: IssuesFieldsState,
    }) => {
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
    issuesMap: IssuesResources,
    epics: Array<Issue>,
    fieldsMap: IssuesFieldsResources,
    issueId: Id,
    epicLinkFieldId: Id | null,
    epicNameFieldId: Id | null,
    epicColorFieldId: Id | null,
  ) => {
    const issue = issuesMap[issueId];
    if (epicLinkFieldId) {
      const epicKey = issue.fields[epicLinkFieldId];
      if (epicKey && epicColorFieldId && epicNameFieldId) {
        const epic = epics.find(e => e.key === epicKey);
        if (epic) {
          return {
            ...epic,
            color: epic.fields[epicColorFieldId],
            name: epic.fields[epicNameFieldId],
          };
        }
      }
    }
    return null;
  },
);


export const getSelectedIssueReport = createSelector(
  [
    // $FlowFixMe
    getSelectedIssue,
    getSelectedIssueWorklogs,
    getSelfKey,
  ],
  (
    issue: Issue,
    worklogs: Array<Worklog>,
    selfKey: Id | null,
  ) => {
    const timespent = issue.fields.timespent || 0;
    const remaining = issue.fields.timeestimate || 0;
    const estimate = remaining - timespent < 0 ? 0 : remaining - timespent;

    const loggedTotal = worklogs.reduce((v, w) => v + w.timeSpentSeconds, 0);
    const yourWorklogs = worklogs.filter(w => R.path(['author', 'key'], w) === selfKey);
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


export const getTrackingIssueReport = createSelector(
  [
    // $FlowFixMe
    getTrackingIssue,
    getTrackingIssueWorklogs,
  ],
  (
    issue: Issue,
    worklogs: Array<Worklog>,
  ) => {
    const timespent = issue.fields.timespent || 0;
    const remaining = issue.fields.timeestimate || 0;
    const originalestimate = issue.fields.timeoriginalestimate || 0;
    const estimate = remaining - timespent < 0 ? 0 : remaining - timespent;

    const loggedTotal = worklogs.reduce((v, w) => v + w.timeSpentSeconds, 0);

    return {
      timespent,
      remaining,
      estimate,
      loggedTotal,
      originalestimate,
    };
  },
);

export const getIssuesSourceOptions = createSelector(
  [
    getResourceMappedList('projects', 'allProjects'),
    getResourceMappedList('boards', 'allBoards'),
    getResourceMappedList('filters', 'allFilters'),
  ],
  (
    projects: Array<Project>,
    boards: Array<Board>,
    filters: Array<JIRAFilter>,
  ) => [
    {
      heading: 'Projects',
      items: projects.map(project =>
        ({ value: project.id, content: `${project.name}(${project.key})`, meta: { project } })),
    },
    {
      heading: 'Boards',
      items: boards.map(board =>
        ({ value: board.id, content: board.name, meta: { board } })),
    },
    {
      heading: 'Favourite JQL Filters',
      items: filters.map(filter =>
        ({ value: filter.id, content: filter.name, meta: { filter } })),
    },
  ],
);

export const getIssuesSourceSelectedOption = createSelector(
  [
    getUiState('issuesSourceType'),
    getUiState('issuesSourceId'),
    getResourceMap('projects'),
    getResourceMap('boards'),
    getResourceMap('filters'),
  ],
  (
    type: string,
    id: Id,
    projectsMap: ProjectsResources,
    boardsMap: BoardsResources,
    filtersMap: FiltersResources,
  ) => {
    if (!id) {
      return null;
    }
    switch (type) {
      case 'project': {
        const project = projectsMap[id];
        if (!project) {
          return null;
        }
        return {
          value: project.id,
          content: project.name,
          meta: {
            project,
          },
        };
      }
      case 'filter': {
        const filter = filtersMap[id];
        if (!filter) {
          return null;
        }
        return {
          value: filter.id,
          content: filter.name,
          meta: {
            filter,
          },
        };
      }
      case 'kanban':
      case 'scrum': {
        const board = boardsMap[id];
        if (!board) {
          return null;
        }
        return {
          value: board.id,
          content: board.name,
          meta: {
            board,
          },
        };
      }
      default:
        return null;
    }
  },
);
