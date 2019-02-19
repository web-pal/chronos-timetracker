// @flow
import * as eff from 'redux-saga/effects';
import * as Sentry from '@sentry/electron';
import createActionCreators from 'redux-resource-action-creators';

import {
  jiraApi,
} from 'api';
import {
  trackMixpanel,
} from 'utils/stat';

import type {
  Id,
} from 'types';

import {
  getFieldIdByName,
  getUserData,
  getUiState,
  getCurrentProjectId,
  getAllProjectsKeys,
  getResourceMap,
  getResourceItemById,
  getResourceMeta,
} from 'selectors';
import {
  uiActions,
  resourcesActions,
  actionTypes,
} from 'actions';
import {
  trayActions,
} from 'shared/actions';

import {
  throwError,
  infoLog,
  notify,
} from './ui';
import {
  getAdditionalWorklogsForIssues,
} from './worklogs';
import {
  getIssueComments,
} from './comments';


const JQL_RESTRICTED_CHARS_REGEX = /[+.,;?|*/%^$#@[\]]/;

export function transformFilterValue(value: string): string {
  return JQL_RESTRICTED_CHARS_REGEX.test(value) ? `"${value}"` : String(value);
}

const ISSUE_FIELDS = [
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
  'attachment',
];

/* eslint-disable */
const normalizeIssues = issues => {
  try {
    return issues.reduce((acc, issue) => {
      const worklogs = issue.fields.worklog ? issue.fields.worklog.worklogs : [];
      acc.entities.worklogs =
        worklogs.reduce(
          (wacc, worklog) => {
            wacc[worklog.id] = worklog;
            return wacc;
          },
          acc.entities.worklogs,
        );
      issue.fields.worklogs = worklogs.map(w => w.id);
      delete issue.fields.worklog;
      acc.entities.issues[issue.id] = issue;
      acc.result.push(issue.id);
      return acc;
    }, {
      entities: {
        issues: {},
        worklogs: {},
      },
      result: [],
    });
  } catch (err) {
    Sentry.captureMessage('normalizedIssues error!', {
      level: 'error',
      extra: {
        issues,
      },
    });
    throw err;
  }
}
/* eslint-enable */

function mapAssignee(assigneeId: string) {
  return assigneeId === 'unassigned' ? 'assignee is EMPTY' : 'assignee = currentUser()';
}

function mapSearchValue(
  searchValue: string,
  projectKeys: Array<string>,
): string {
  if (projectKeys.some(key => searchValue.startsWith(`${key}-`))) {
    return `key = "${searchValue}"`;
  }
  if (/^[0-9]*$/.test(searchValue)) {
    return (
      `(${projectKeys.map(key => (
        `key="${key}-${searchValue}"`
      )).join(' OR ')}  OR summary ~ "${searchValue.replace(/\s+$/, '')}*")`
    );
  }
  return `summary ~ "${searchValue.replace(/\s+$/, '')}*"`;
}

function buildJQLQuery({
  issuesFilters = {
    type: [],
    status: [],
    assignee: [],
  },
  searchValue = '',
  projectKeys,
  projectId,
  sprintId,
  filterId,
  worklogAuthor,
  additionalJQL,
}: {
  issuesFilters?: {
    type: Array<string>,
    status: Array<string>,
    assignee: Array<string>,
  },
  searchValue?: string,
  projectKeys?: Array<string> | null,
  projectId?: number | string | null,
  sprintId?: number | string | null,
  filterId?: string | null,
  worklogAuthor?: string | null,
  additionalJQL?: string | null,
}) {
  const {
    type,
    status,
    assignee,
  } = issuesFilters;
  const jql = [
    (projectId && `project = ${projectId}`),
    (filterId && `filter = ${filterId}`),
    (sprintId && `sprint = ${sprintId}`),
    (worklogAuthor && `worklogAuthor = ${worklogAuthor}`),
    (type.length && `issueType in (${type.join(',')})`),
    (status.length && `status in (${status.join(',')})`),
    (assignee.length && mapAssignee(assignee[0])),
    ((searchValue.length && projectKeys) && mapSearchValue(searchValue, projectKeys)),
    (additionalJQL && additionalJQL),
  ].filter(f => !!f).join(' AND ');
  return jql;
}

function* fetchAdditionalWorklogsForIssues(issues) {
  try {
    const incompleteIssues = issues.filter(
      issue => (
        issue.fields.worklog === undefined
        || (issue.fields?.worklog?.total || 0) > 20
      ),
    );
    if (incompleteIssues.length) {
      yield eff.call(
        infoLog,
        'found issues lacking worklogs',
        incompleteIssues,
      );
      const additionalIssuesArr = yield eff.call(
        getAdditionalWorklogsForIssues,
        incompleteIssues,
      );
      const withAdditionalWorklogs = [
        ...issues.filter(i => (i.fields?.worklog?.total || 0) <= 20),
        ...additionalIssuesArr,
      ];
      yield eff.call(
        infoLog,
        'getAdditionalWorklogsForIssues response:',
        additionalIssuesArr,
      );
      yield eff.call(
        infoLog,
        'filled issues with lacking worklogs: ',
        withAdditionalWorklogs,
      );
      return withAdditionalWorklogs;
    }
    return issues;
  } catch (err) {
    Sentry.captureMessage('Fetch additional worklog issue', {
      level: 'error',
      extra: {
        issues,
      },
    });
    yield eff.call(throwError, err);
    return issues;
  }
}

export function* fetchIssues({
  payload: {
    startIndex,
    stopIndex,
    resolve,
  },
  tryCount = 0,
}: {
  payload: {
    startIndex: number,
    stopIndex: number,
    resolve: null | () => void,
  },
  tryCount: number,
}): Generator<*, *, *> {
  const actions = createActionCreators('read', {
    resourceType: 'issues',
    request: 'filterIssues',
    list: 'filterIssues',
    startIndex,
    stopIndex,
    indexedList: true,
    mergeListIds: true,
  });
  try {
    yield eff.call(
      infoLog,
      'started fetchIssues',
    );
    yield eff.put(actions.pending());

    const issuesSourceId: string | null = yield eff.select(getUiState('issuesSourceId'));
    const issuesSourceType: string | null = yield eff.select(getUiState('issuesSourceType'));
    const issuesSprintId: string | null = yield eff.select(getUiState('issuesSprintId'));
    const searchValue: string = yield eff.select(getUiState('issuesSearch'));
    const issuesFilters = yield eff.select(getUiState('issuesFilters'));
    const projectId = yield eff.select(getCurrentProjectId);

    const projectsMap = yield eff.select(getResourceMap('projects'));
    const project = projectsMap[projectId];
    const projectKey = project ? project.key : null;

    const epicLinkFieldId: string | null = yield eff.select(getFieldIdByName('Epic Link'));
    const jql: string = buildJQLQuery({
      issuesFilters,
      searchValue,
      projectId: issuesSourceType === 'project' ? issuesSourceId : null,
      filterId: issuesSourceType === 'filter' ? issuesSourceId : null,
      projectKeys: issuesSourceType === 'filter' ? yield eff.select(getAllProjectsKeys) : [projectKey],
      sprintId: issuesSourceType === 'scrum' ? issuesSprintId : null,
    });

    const response = (
      jql.length
      || (
        issuesSourceId
        && ['board', 'kanban'].includes(issuesSourceType)
      )
    ) ? (
        yield eff.call(
          jiraApi.searchForIssues,
          {
            params: {
              startAt: startIndex,
              maxResults: (
                ((stopIndex - startIndex) + 1) < 10
                  ? 10
                  : (stopIndex - startIndex) + 1
              ),
              jql,
              boardId: ['board', 'kanban'].includes(issuesSourceType) ? issuesSourceId : null,
              fields: [
                ...ISSUE_FIELDS,
                ...(
                  epicLinkFieldId ? (
                    [epicLinkFieldId]
                  ) : []
                ),
              ],
              expand: ['renderedFields'],
            },
          },
        )
      ) : ({
        total: 0,
        issues: [],
      });
    yield eff.call(
      infoLog,
      'fetchIssues response',
      response,
    );
    const issues = yield eff.call(
      fetchAdditionalWorklogsForIssues,
      response.issues,
    );
    yield eff.put(resourcesActions.setResourceMeta({
      resourceType: 'issues',
      meta: {
        filterIssuesTotalCount: response.total,
      },
    }));
    const normalizedIssues = normalizeIssues(issues);
    yield eff.put(actions.succeeded({
      resources: normalizedIssues.result,
      includedResources: normalizedIssues.entities,
    }));
    if (resolve) {
      resolve();
    }
  } catch (err) {
    if (
      ['ETIMEDOUT', 'ECONNREFUSED', 'ESOCKETTIMEDOUT'].includes(err.code)
      && !tryCount
    ) {
      yield eff.fork(
        fetchIssues,
        {
          tryCount: tryCount + 1,
          payload: {
            startIndex,
            stopIndex,
            resolve,
          },
        },
      );
    } else {
      yield eff.put(resourcesActions.setResourceMeta({
        resourceType: 'issues',
        meta: {
          filterIssuesTotalCount: 0,
        },
      }));
      yield eff.put(actions.succeeded({
        resources: [],
      }));
      yield eff.call(throwError, err);
    }
  }
}

export function* fetchRecentIssues(): Generator<*, *, *> {
  const actions = createActionCreators('read', {
    resourceType: 'issues',
    request: 'recentIssues',
    list: 'recentIssues',
  });
  try {
    yield eff.call(
      infoLog,
      'started fetchRecentIssues',
    );
    yield eff.put(actions.pending());

    const issuesSourceId: string | null = yield eff.select(getUiState('issuesSourceId'));
    const issuesSourceType: string | null = yield eff.select(getUiState('issuesSourceType'));
    const issuesSprintId: string | null = yield eff.select(getUiState('issuesSprintId'));

    const epicLinkFieldId: string | null = yield eff.select(getFieldIdByName('Epic Link'));

    const jql: string = buildJQLQuery({
      projectId: issuesSourceType === 'project' ? issuesSourceId : null,
      filterId: issuesSourceType === 'filter' ? issuesSourceId : null,
      sprintId: issuesSourceType === 'scrum' ? issuesSprintId : null,
      worklogAuthor: 'currentUser()',
      additionalJQL: 'timespent > 0 AND worklogDate >= "-4w"',
    });

    const response = (
      (issuesSprintId && issuesSourceId)
      || (!issuesSprintId && issuesSourceId)
      || jql.length
    ) ? (
        yield eff.call(
          jiraApi.searchForIssues,
          {
            params: {
              startAt: 0,
              maxResults: 1000,
              jql,
              boardId: ['board', 'kanban'].includes(issuesSourceType) ? issuesSourceId : null,
              fields: [
                ...ISSUE_FIELDS,
                ...(
                  epicLinkFieldId ? (
                    [epicLinkFieldId]
                  ) : []
                ),
              ],
              expand: ['renderedFields'],
            },
          },
        )
      ) : ({
        total: 0,
        issues: [],
      });
    yield eff.call(
      infoLog,
      'fetchRecentIssues response',
      response,
    );
    const issues = yield eff.call(
      fetchAdditionalWorklogsForIssues,
      response.issues,
    );
    const normalizedIssues = normalizeIssues(issues);
    yield eff.put(actions.succeeded({
      resources: normalizedIssues.result,
      includedResources: normalizedIssues.entities,
    }));
  } catch (err) {
    yield eff.put(actions.succeeded({
      resources: [],
    }));
    yield eff.call(throwError, err);
  }
}

export function* refetchIssues(debouncing: boolean): Generator<*, void, *> {
  try {
    if (debouncing) {
      yield eff.call(delay, 500);
    }
    yield eff.put(resourcesActions.clearResourceList({
      resourceType: 'issues',
      list: 'filterIssues',
    }));
    const currentTotalCount = yield eff.select(getResourceMeta(
      'issues',
      'filterIssuesTotalCount',
    ));
    if (!currentTotalCount) {
      yield eff.put(resourcesActions.setResourceMeta({
        resourceType: 'issues',
        meta: {
          filterIssuesTotalCount: 10,
        },
      }));
    }
    yield eff.put(resourcesActions.setResourceMeta({
      resourceType: 'issues',
      meta: {
        refetchFilterIssuesMarker: true,
      },
    }));

    const sidebarType = yield eff.select(getUiState('sidebarType'));
    if (sidebarType === 'recent') {
      yield eff.put(resourcesActions.clearResourceList({
        resourceType: 'issues',
        list: 'recentIssues',
      }));
      yield eff.call(fetchRecentIssues);
    }
  } catch (err) {
    yield eff.call(throwError, err);
  }
}

export function* getIssueTransitions(issueId: string | number): Generator<*, void, *> {
  const actions = createActionCreators('read', {
    resourceType: 'issuesStatuses',
    request: 'issueTransitions',
    list: 'issueTransitions',
    mergeListIds: false,
  });
  try {
    yield eff.put(actions.pending());
    yield eff.call(
      infoLog,
      `getting available issue transitions for ${issueId}`,
    );
    const { transitions } = yield eff.call(
      jiraApi.getIssueTransitions,
      {
        params: {
          issueIdOrKey: issueId,
        },
      },
    );
    yield eff.put(actions.succeeded({
      resources: transitions,
    }));
    yield eff.call(
      infoLog,
      `got issue ${issueId} available transitions`,
      transitions,
    );
  } catch (err) {
    yield eff.call(throwError, err);
  }
}

export function* transitionIssue({
  issueId,
  transitionId,
}: {
  issueId: Id,
  transitionId: Id,
}): Generator<*, void, *> {
  const issuesA = createActionCreators('update', {
    resourceType: 'issues',
    request: 'updateIssue',
  });
  try {
    const issue = yield eff.select(getResourceItemById('issues', issueId));
    const transition = yield eff.select(getResourceItemById('issuesStatuses', transitionId));

    yield eff.put(issuesA.pending());
    yield eff.fork(notify, {
      resourceType: 'issues',
      request: 'updateIssue',
      spinnerTitle: 'Please wait',
      description: '',
      title: `Moved issue ${issue.key} to ${transition.to.name}`,
    });
    yield eff.call(
      jiraApi.transitionIssue,
      {
        params: {
          issueIdOrKey: issueId,
        },
        body: {
          transition: transitionId,
        },
      },
    );

    yield eff.put(issuesA.succeeded({
      resources: [{
        ...issue,
        fields: {
          ...issue.fields,
          status: transition.to,
        },
      }],
    }));
    yield eff.fork(getIssueTransitions, issueId);

    trackMixpanel('Transition of an issue was done');
  } catch (err) {
    yield eff.put(issuesA.succeeded({
      resources: [],
    }));
    yield eff.call(throwError, err);
  }
}

export function* getIssuePermissions(issueId: string | number): Generator<*, void, *> {
  try {
    const { permissions } = yield eff.call(
      jiraApi.getMyPermissions,
      {
        params: {
          issueId,
        },
      },
    );
    yield eff.put(resourcesActions.setResourceMeta({
      resourceType: 'issues',
      resources: [issueId],
      meta: {
        permissions,
      },
    }));
  } catch (err) {
    yield eff.call(throwError, err);
  }
}

export function* issueSelectFlow(issueId: string | number): Generator<*, *, *> {
  const issue = yield eff.select(getResourceItemById('issues', issueId));
  yield eff.put(trayActions.traySelectIssue(issue.key));
  yield eff.fork(getIssueTransitions, issueId);
  yield eff.fork(getIssueComments, issueId);
  yield eff.fork(getIssuePermissions, issueId);
}

export function* assignIssueToUser({ issueId }: {
  issueId: Id,
}): Generator<*, void, *> {
  const issuesA = createActionCreators('update', {
    resourceType: 'issues',
    request: 'updateIssue',
  });
  try {
    yield eff.put(issuesA.pending());

    const issue = yield eff.select(getResourceItemById('issues', issueId));
    const userData = yield eff.select(getUserData);

    yield eff.call(
      infoLog,
      `assigning issue ${issue.key} to self (${userData.key})`,
    );
    yield eff.call(
      jiraApi.assignIssue,
      {
        params: {
          issueIdOrKey: issue.key,
        },
        body: {
          key: userData.key,
        },
      },
    );
    yield eff.call(
      infoLog,
      `succesfully assigned issue ${issue.key} to self (${userData.key})`,
    );

    yield eff.put(issuesA.succeeded({
      resources: [{
        ...issue,
        fields: {
          ...issue.fields,
          assignee: userData,
        },
      }],
    }));

    yield eff.fork(notify, {
      title: `${issue.key} is assigned to you`,
    });
    trackMixpanel('Issue was assigned to user');
  } catch (err) {
    yield eff.fork(notify, {
      title: 'Cannot assign issue. Probably no permission',
    });
    yield eff.call(throwError, err);
  }
}

export function* fetchIssueFields(): Generator<*, void, *> {
  const actions = createActionCreators('read', {
    resourceType: 'issuesFields',
    request: 'issuesFields',
    list: 'allFields',
    mergeListIds: true,
  });
  try {
    yield eff.put(actions.pending());
    yield eff.call(infoLog, 'fetching issue fields');
    const issuesFields = yield eff.call(jiraApi.getAllIssueFields);
    yield eff.put(actions.succeeded({
      resources: issuesFields,
    }));
    yield eff.call(infoLog, 'got issue fields', issuesFields);
  } catch (err) {
    yield eff.call(throwError, err);
  }
}

export function* fetchEpics(): Generator<*, void, *> {
  const actions = createActionCreators('read', {
    resourceType: 'issues',
    request: 'epicIssues',
    list: 'epicIssues',
    mergeListIds: true,
  });
  try {
    yield eff.put(actions.pending());
    yield eff.call(infoLog, 'fetching epics');
    const response = yield eff.call(
      jiraApi.searchForIssues,
      {
        params: {
          startAt: 0,
          maxResults: 100,
          jql: "issuetype = 'Epic'",
          fields: ISSUE_FIELDS,
        },
      },
    );
    const additionalIssues = (
      response.total > response.issues.length
        ? (
          yield eff.all(
            Array.from(Array(Math.ceil(response.total / response.maxResults) - 1).keys()).map(
              i => (
                eff.call(
                  jiraApi.searchForIssues,
                  {
                    params: {
                      startAt: (i + 1) * response.maxResults,
                      maxResults: response.maxResults,
                      jql: "issuetype = 'Epic'",
                      fields: ISSUE_FIELDS,
                    },
                  },
                )),
            ),
          )
        ) : (
          []
        )
    );
    const issues = [
      ...response.issues,
    ].concat(...additionalIssues.map(i => i.issues));
    yield eff.put(actions.succeeded({
      resources: issues,
    }));
    yield eff.call(infoLog, 'got epics', issues);
  } catch (err) {
    yield eff.put(actions.succeeded({
      resources: [],
    }));
    yield eff.call(throwError, err);
  }
}

function* fetchNewIssue({ issueIdOrKey }): Generator<*, *, *> {
  const actions = createActionCreators('create', {
    resourceType: 'issues',
    request: 'createIssue',
  });
  try {
    const epicLinkFieldId: string | null = yield eff.select(getFieldIdByName('Epic Link'));
    const issue = yield eff.call(
      jiraApi.getIssueByIdOrKey,
      {
        params: {
          issueIdOrKey,
          fields: [
            ...ISSUE_FIELDS,
            ...(
              epicLinkFieldId ? (
                [epicLinkFieldId]
              ) : []
            ),
          ],
        },
      },
    );
    yield eff.put(actions.pending());
    yield eff.fork(notify, {
      title: `${issue.key} was created`,
    });
    issue.fields.worklogs = [];
    yield eff.put(actions.succeeded({
      resources: [issue],
    }));
    yield eff.put(uiActions.setUiState({
      selectedIssueId: issue.id,
    }));
    yield eff.fork(refetchIssues, false);
    trackMixpanel('New issue was created');
  } catch (err) {
    yield eff.call(throwError, err);
  }
}

function* fetchUpdateIssue({ issueIdOrKey }): Generator<*, *, *> {
  const actions = createActionCreators('update', {
    resourceType: 'issues',
    resources: [issueIdOrKey],
  });
  try {
    yield eff.put(actions.pending());
    const prevIssue = yield eff.select(getResourceItemById('issues', issueIdOrKey));
    const epicLinkFieldId: string | null = yield eff.select(getFieldIdByName('Epic Link'));
    const issue = yield eff.call(
      jiraApi.getIssueByIdOrKey,
      {
        params: {
          issueIdOrKey,
          fields: [
            ...ISSUE_FIELDS,
            ...(
              epicLinkFieldId ? (
                [epicLinkFieldId]
              ) : []
            ),
          ],
        },
      },
    );
    yield eff.fork(notify, {
      title: `${issue.key} was updated`,
    });
    issue.fields.worklogs = prevIssue.fields.worklogs;
    yield eff.put(actions.succeeded({
      resources: [issue],
    }));
    yield eff.put(uiActions.setUiState({
      selectedIssueId: issue.id,
    }));
  } catch (err) {
    yield eff.call(throwError, err);
  }
}

export function* takeFetchNewIssue(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.FETCH_NEW_ISSUE_REQUEST, fetchNewIssue);
}

export function* takeFetchUpdateIssue(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.FETCH_UPDATE_ISSUE_REQUEST, fetchUpdateIssue);
}

export function* watchFetchIssuesRequest(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.FETCH_ISSUES_REQUEST, fetchIssues);
}

export function* watchFetchRecentIssuesRequest(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.FETCH_RECENT_ISSUES_REQUEST, fetchRecentIssues);
}

export function* watchTransitionIssueRequest(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.TRANSITION_ISSUE_REQUEST, transitionIssue);
}

export function* watchAssignIssueRequest(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.ASSIGN_ISSUE_REQUEST, assignIssueToUser);
}

export function* watchReFetchIssuesRequest(): Generator<*, *, *> {
  let task;
  while (true) {
    const { debouncing } = yield eff.take(actionTypes.REFETCH_ISSUES_REQUEST);
    if (task) {
      yield eff.cancel(task);
    }
    task = yield eff.fork(refetchIssues, debouncing);
  }
}
