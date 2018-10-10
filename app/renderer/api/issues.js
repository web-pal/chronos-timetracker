// @flow

import type {
  Id,
} from 'types';

import jira from 'utils/jiraClient';

const requiredFields: Array<string> = [
  'issuetype',
  'project',
  'labels',
  'priority',
  'status',
  'resolution',
  'summary',
  'reporter',
  'assignee',
  'description',
  'worklog',
  'timeestimate',
  'timespent',
  'timeoriginalestimate',
  'fixVersions',
  'versions',
  'components',
];

export function getIssueTransitions(issueId: Id): Promise<*> {
  return jira.client.issue.getTransitions({ issueId });
}

export function transitionIssue(issueId: Id, transitionId: Id): Promise<*> {
  return jira.client.issue.transitionIssue({
    issueId,
    transition: transitionId,
  });
}

export function fetchEpics(): Promise<*> {
  const jql: string = "issuetype = 'Epic'";
  return jira.client.search.search({ jql, maxResults: 1000, startAt: 0 });
}

export function fetchIssues({
  startIndex,
  stopIndex,
  jql,
  additionalFields = [],
  boardId,
}: {
  startIndex: number,
  stopIndex: number,
  jql: string,
  additionalFields: Array<string>,
  boardId?: number | string | null,
  timeout?: number,
}): Promise<*> {
  const api = boardId ?
    opts => jira.client.board.getIssuesForBoard({ ...opts, boardId }) :
    opts => jira.client.search.search(opts);
  return api({
    jql,
    maxResults: (stopIndex - startIndex) + 1,
    startAt: startIndex,
    fields: [
      ...requiredFields,
      ...additionalFields,
    ],
    expand: ['renderedFields'],
  });
}

export function fetchIssue(issueId: string): Promise<*> {
  return jira.client.issue.getIssue({
    issueId,
    fields: requiredFields,
  });
}

export function fetchIssueByKey(issueKey: string): Promise<*> {
  return jira.client.issue.getIssue({
    issueKey,
    fields: requiredFields,
  });
}


export function fetchRecentIssues({
  projectId,
  projectType,
  sprintId,
  worklogAuthor,
}: {
  projectId: string,
  projectType: string,
  sprintId?: string,
  worklogAuthor: string,
}) {
  const jql = [
    (projectType === 'project' ? `project = ${projectId}` : ''),
    ((projectType === 'scrum') && sprintId ? `sprint = ${sprintId}` : ''),
    `worklogAuthor = ${worklogAuthor} `,
    'timespent > 0 AND worklogDate >= "-4w"',
  ].filter(f => !!f).join(' AND ');

  const api = projectType === 'project'
    ? opts => jira.client.search.search(opts)
    : opts => jira.client.board.getIssuesForBoard({ ...opts, boardId: projectId });

  return api({
    jql,
    maxResults: 1000,
    fields: requiredFields,
  });
}

export function assignIssue({
  issueKey,
  assignee,
}: { issueKey: string, assignee: string }): Promise<*> {
  return jira.client.issue.assignIssue({ issueKey, assignee });
}

export function fetchIssueFields(): Promise<*> {
  return jira.client.field.getAllFields();
}

export function fetchIssueComments(issueId: Id): Promise<*> {
  return jira.client.issue.getComments({ issueId, expand: ['renderedBody'] });
}

export function addComment({
  issueId,
  comment,
}: {
  issueId: Id,
  comment: {
    body: string,
  }
}): Promise<*> {
  return jira.client.issue.addComment({ issueId, comment });
}

export function getIssuesMetadata(projectId: Id | null): Promise<*> {
  const opts = {};
  if (projectId) {
    opts.projectIds = projectId;
  }
  return jira.client.issue.getCreateMetadata(opts);
}
