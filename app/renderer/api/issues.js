// @flow

import type {
  Id,
} from 'types';

import client from './client';

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
  return client.getIssueTransitions({ issueId });
}

export function transitionIssue(issueId: Id, transitionId: Id): Promise<*> {
  return client.transitionIssue({
    issueId,
    body: {
      transition: transitionId,
    },
  });
}

export function fetchEpics(): Promise<*> {
  const jql: string = "issuetype = 'Epic'";
  return client.search({
    queryParameters: {
      jql,
      maxResults: 1000,
      startAt: 0,
    },
  });
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
  const api = boardId
    ? queryParameters => client.getIssuesForBoard({ queryParameters, boardId })
    : queryParameters => client.search({ queryParameters });
  return api({
    jql,
    maxResults: (stopIndex - startIndex) + 1,
    validateQuery: false,
    startAt: startIndex,
    fields: [
      ...requiredFields,
      ...additionalFields,
    ],
    expand: ['renderedFields'],
  });
}

export function fetchIssue(issueId: string): Promise<*> {
  return client.getIssue({
    issueId,
    queryParameters: {
      fields: requiredFields,
    },
  });
}

export function fetchIssueByKey(issueKey: string): Promise<*> {
  return client.getIssue({
    issueKey,
    queryParameters: {
      fields: requiredFields,
    },
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
    ? queryParameters => client.search({ queryParameters })
    : queryParameters => client.getIssuesForBoard({
      queryParameters,
      boardId: projectId,
    });

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
  return client.assignIssue({
    issueKey,
    body: {
      name: assignee,
    },
  });
}

export function fetchIssueFields(): Promise<*> {
  return client.getAllFields();
}

export function fetchIssueComments(issueId: Id): Promise<*> {
  return client.getIssueComments({
    issueId,
    queryParameters: {
      expand: ['renderedBody'],
    },
  });
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
  return client.addIssueComment({
    issueId,
    body: comment,
  });
}

export function getIssuesMetadata(projectId: Id | null): Promise<*> {
  const queryParameters = {};
  if (projectId) {
    queryParameters.projectIds = projectId;
  }
  return client.getCreateMetadata({ queryParameters });
}
