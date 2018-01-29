// @flow
import {
  delay,
} from 'redux-saga';
import {
  call,
  take,
  select,
  put,
  fork,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import {
  normalize,
  schema,
} from 'normalizr';
import createActionCreators from 'redux-resource-action-creators';
import { ipcRenderer } from 'electron';
import * as Api from 'api';
import merge from 'lodash.merge';
import Raven from 'raven-js';
import {
  getSelectedProject,
  getSelectedProjectId,
  getSelectedSprintId,
  getFieldIdByName,
  getUserData,
  getRecentIssueIds,
  getIssuesSearchValue,
  getComments,
  getFoundIssueIds,
  getIssueFilters,
  getIssuesFilters,
  getSelectedIssueId,
  getSelectedIssue,
  getIssueViewTab,
  getSelectedProjectType,
  getResourceIds,
  getResourceMap,
  getUiState,
} from 'selectors';
import {
  issuesActions,
  resourcesActions,
  types,
} from 'actions';
import normalizePayload from 'normalize-util';

import { throwError, infoLog, notify } from './ui';
import { setToStorage, getFromStorage } from './storage';
import { getAdditionalWorklogsForIssues } from './worklogs';
import createIpcChannel from './ipc';

import type {
  FetchIssuesRequestAction,
  Project,
  Id,
  User,
  IssueFilters,
  SelectIssueAction,
  Issue,
  CommentRequestAction,
} from '../types';

const JQL_RESTRICTED_CHARS_REGEX = /[+.,;?|*/%^$#@[\]]/;

export function transformFilterValue(value: string): string {
  return JQL_RESTRICTED_CHARS_REGEX.test(value) ? `"${value}"` : String(value);
}

function mapAssignee(assigneeId: string) {
  return assigneeId === 'unassigned' ? 'assignee is EMPTY' : 'assignee = currentUser()';
}

function mapSearchValue(searchValue: string, projectKey: string): string {
  if (searchValue.startsWith(`${projectKey}-`)) {
    return `key = "${searchValue}"`;
  }
  if (/^[0-9]*$/.test(searchValue)) {
    return `(key = "${projectKey}-${searchValue}" OR summary ~ "${searchValue}")`;
  }
  return `summary ~ "${searchValue}"`;
}

function buildJQLQuery({
  projectId,
  sprintId,
  worklogAuthor,
  additionalJQL,
}) {
  const jql = [
    (projectId && `project = ${projectId}`),
    (sprintId && `sprint = ${sprintId}`),
    (worklogAuthor && `worklogAuthor = ${worklogAuthor}`),
    (additionalJQL && additionalJQL),
  ].filter(f => !!f).join(' AND ');
  return jql;
}

function* fetchAdditionalWorklogsForIssues(issues) {
  const incompleteIssues = issues.filter(issue => issue.fields.worklog.total > 20);
  if (incompleteIssues.length) {
    yield call(
      infoLog,
      'found issues lacking worklogs',
      incompleteIssues,
    );
    const {
      additionalIssuesArr,
    } = yield call(getAdditionalWorklogsForIssues, incompleteIssues);
    yield call(
      infoLog,
      'getAdditionalWorklogsForIssues response:',
      additionalIssuesArr,
    );

    const withAdditionalWorklogs = [
      ...issues,
      ...additionalIssuesArr,
    ];
    yield call(
      infoLog,
      'filled issues with lacking worklogs: ',
      withAdditionalWorklogs,
    );
    return withAdditionalWorklogs;
  }
  return issues;
}

export function* fetchProjectIssuesStatuses(): Generator<*, *, *> {
  const actions = createActionCreators('read', {
    resourceName: 'issuesTypes',
    request: 'issuesTypes',
    list: 'issuesTypes',
    mergeListIds: false,
  });
  try {
    const issuesSourceId: string | null = yield select(getUiState('issuesSourceId'));
    const issuesSourceType: string | null = yield select(getUiState('issuesSourceType'));
    const issuesSprintId: string | null = yield select(getUiState('issuesSprintId'));

    let projectId = issuesSourceId;
    if (issuesSourceId && issuesSourceType === 'kanban') {
      const boards = yield select(getResourceMap('boards'));
      const board = boards[issuesSourceId];
      if (board) {
        projectId = board.location.projectId; // eslint-disable-line
      }
    }
    if (issuesSprintId && issuesSourceType === 'scrum') {
      const sprints = yield select(getResourceMap('sprints'));
      const sprint = sprints[issuesSprintId];
      if (sprint) {
        const boards = yield select(getResourceMap('boards'));
        const board = boards[sprint.originBoardId];
        if (board) {
          projectId = board.location.projectId; // eslint-disable-line
        }
      }
    }
    if (projectId) {
      yield put(actions.pending());
      const statuses = yield call(Api.fetchProjectStatuses, projectId);
      const statusesSchema = new schema.Entity('issuesStatuses');
      const typesSchema = new schema.Entity('issuesTypes', {
        statuses: [statusesSchema],
      });
      const normalizedData = normalize(statuses, [typesSchema]);
      yield put(actions.succeeded({
        resources: normalizedData.result,
        includedResources: normalizedData.entities,
      }));
    }
  } catch (err) {
    yield call(throwError, err);
  }
}

export function* fetchIssues({
  payload: {
    startIndex,
    stopIndex,
    resolve,
    search,
  },
}: FetchIssuesRequestAction): Generator<*, *, *> {
  const actions = createActionCreators('read', {
    resourceName: 'issues',
    request: 'filterIssues',
    list: 'filterIssues',
    startIndex,
    indexedList: true,
    mergeListIds: true,
  });
  try {
    yield call(
      infoLog,
      'started fetchIssues',
    );
    yield put(actions.pending());
    if (search) {
      yield put(issuesActions.setIssuesTotalCount(0));
      yield put(issuesActions.clearFoundIssueIds());
    }

    const issuesSourceId: string | null = yield select(getUiState('issuesSourceId'));
    const issuesSourceType: string | null = yield select(getUiState('issuesSourceType'));
    const issuesSprintId: string | null = yield select(getUiState('issuesSprintId'));

    const epicLinkFieldId: string | null = yield select(getFieldIdByName, 'Epic Link');
    const jql: string = buildJQLQuery({
      projectId: issuesSourceType === 'project' ? issuesSourceId : null,
      sprintId: issuesSourceType === 'scrum' ? issuesSprintId : null,
    });

    const response = jql.length ?
      yield call(
        Api.fetchIssues,
        {
          startIndex,
          stopIndex,
          jql,
          boardId: issuesSourceType !== 'project' ? issuesSourceId : null,
          epicLinkFieldId,
        },
      ) :
      {
        total: 0,
        issues: [],
      };
    yield call(
      infoLog,
      'fetchIssues response',
      response,
    );
    const issues = yield call(
      fetchAdditionalWorklogsForIssues,
      response.issues,
    );
    yield put(resourcesActions.setResourceMeta({
      resourceName: 'issues',
      meta: {
        filterIssuesTotalCount: response.total,
      },
    }));
    yield put(actions.succeeded({
      resources: issues,
    }));
    /*
    if (search) {
      yield put(issuesActions.fillFoundIssueIds(normalizedIssues.ids));
    } else {
      const foundIssueIds = yield select(getFoundIssueIds);
      if (foundIssueIds.length !== 0) {
        yield put(issuesActions.addFoundIssueIds(normalizedIssues.ids));
      }
    }
    */
    if (resolve) {
      resolve();
    }
  } catch (err) {
    yield put(resourcesActions.setResourceMeta({
      resourceName: 'issues',
      meta: {
        filterIssuesTotalCount: 0,
      },
    }));
    yield put(actions.succeeded({
      resources: [],
    }));
    yield call(throwError, err);
    Raven.captureException(err);
  } finally {
    yield fork(fetchProjectIssuesStatuses);
  }
}

export function* watchFetchIssuesRequest(): Generator<*, *, *> {
  yield takeEvery(types.FETCH_ISSUES_REQUEST, fetchIssues);
}

export function* fetchRecentIssues(): Generator<*, *, *> {
  const actions = createActionCreators('read', {
    resourceName: 'issues',
    request: 'recentIssues',
    list: 'recentIssues',
  });
  try {
    yield call(
      infoLog,
      'started fetchRecentIssues',
    );
    yield put(actions.pending());

    const issuesSourceId: string | null = yield select(getUiState('issuesSourceId'));
    const issuesSourceType: string | null = yield select(getUiState('issuesSourceType'));
    const issuesSprintId: string | null = yield select(getUiState('issuesSprintId'));

    const epicLinkFieldId: string | null = yield select(getFieldIdByName, 'Epic Link');
    const profile: User = yield select(getUserData);
    const jql: string = buildJQLQuery({
      projectId: issuesSourceType === 'project' ? issuesSourceId : null,
      sprintId: issuesSourceType === 'scrum' ? issuesSprintId : null,
      worklogAuthor: profile.key,
      additionalJQL: 'timespent > 0 AND worklogDate >= "-4w"',
    });

    const response = (
      (issuesSprintId && issuesSourceId) ||
      (!issuesSprintId && issuesSourceId) ||
      jql.length
    ) ?
      yield call(
        Api.fetchIssues,
        {
          startIndex: 0,
          stopIndex: 1000,
          jql,
          boardId: issuesSourceType !== 'project' ? issuesSourceId : null,
          epicLinkFieldId,
        },
      ) :
      {
        total: 0,
        issues: [],
      };
    yield call(
      infoLog,
      'fetchRecentIssues response',
      response,
    );
    const issues = yield call(
      fetchAdditionalWorklogsForIssues,
      response.issues,
    );
    yield put(actions.succeeded({
      resources: issues,
    }));
  } catch (err) {
    yield put(actions.succeeded({
      resources: [],
    }));
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchFetchRecentIssuesRequest(): Generator<*, *, *> {
  yield takeEvery(types.FETCH_RECENT_ISSUES_REQUEST, fetchRecentIssues);
}

export function* getIssueComments(): Generator<*, void, *> {
  try {
    const selectedIssue: Issue = yield select(getSelectedIssue);
    yield put(issuesActions.setCommentsFetching(true));
    const issueId: Id = selectedIssue.id;
    yield call(infoLog, `fetching comments for issue ${issueId}`);
    const { comments } = yield call(Api.fetchIssueComments, issueId);
    yield call(infoLog, `got comments for issue ${issueId}`, comments);
    yield put(issuesActions.fillComments(comments));
    yield put(issuesActions.setCommentsFetching(false));
  } catch (err) {
    yield put(issuesActions.setCommentsFetching(false));
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

function* getIssueTransitions(issueId: string): Generator<*, void, *> {
  try {
    yield put(issuesActions.setAvailableTransitionsFetching(true));
    yield call(
      infoLog,
      `getting available issue transitions for ${issueId}`,
    );
    const { transitions } = yield call(Api.getIssueTransitions, issueId);
    yield call(
      infoLog,
      `got issue ${issueId} available transitions`,
      transitions,
    );
    yield put(issuesActions.fillAvailableTransitions(transitions));
    yield put(issuesActions.setAvailableTransitionsFetching(false));
  } catch (err) {
    yield put(issuesActions.setAvailableTransitionsFetching(false));
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* fetchIssueTypes(): Generator<*, *, *> {
  try {
    const selectedProjectType = yield select(getSelectedProjectType);
    let selectedProjectId = null;
    if (selectedProjectType === 'project') {
      selectedProjectId = yield select(getSelectedProjectId);
    }
    yield call(infoLog, `fetching issue types for project ${selectedProjectId}`);
    const metadata = yield call(Api.getIssuesMetadata, selectedProjectId);
    const issueTypes = metadata.projects[0].issuetypes;
    yield call(infoLog, `got issue types for project ${selectedProjectId}`, issueTypes);
    const normalizedData = normalizePayload(issueTypes, 'issueTypes');
    yield put(issuesActions.fillIssueTypes(normalizedData));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}


export function* fetchIssueStatuses(): Generator<*, *, *> {
  try {
    const selectedProjectType = yield select(getSelectedProjectType);
    let selectedProjectId = null;
    let issueTypes;
    let issueStatuses;
    const lastFiltersSelected: IssueFilters | null = yield call(getFromStorage, 'lastFiltersSelected');

    if (selectedProjectType === 'project') {
      selectedProjectId = yield select(getSelectedProjectId);
      yield call(infoLog, `fetching issue statuses for project ${selectedProjectId}`);
      issueTypes = yield call(Api.fetchIssueTypes, selectedProjectId);
      issueStatuses = issueTypes[0].statuses;

      if (lastFiltersSelected) {
        const selectedTypes = issueTypes.reduce((results, type) => {
          if (lastFiltersSelected.type.includes(type.id)) {
            results.push(type.id);
          }
          return results;
        }, []);
        yield put(issuesActions.setIssuesFilter(selectedTypes, 'type'));
      }
    } else {
      yield call(infoLog, 'fetching issue statuses for all projects');
      issueStatuses = yield call(Api.fetchIssueStatuses);
    }

    if (lastFiltersSelected) {
      const selectedStatuses = issueStatuses.reduce((results, status) => {
        if (lastFiltersSelected.status.includes(status.id)) {
          results.push(status.id);
        }
        return results;
      }, []);
      yield put(issuesActions.setIssuesFilter(selectedStatuses, 'status'));
      yield put(issuesActions.setIssuesFilter(lastFiltersSelected.assignee, 'assignee'));
    }

    yield call(infoLog, `got issue statuses for project ${selectedProjectId}`, issueStatuses);
    const normalizedData = normalizePayload(issueStatuses, 'issueStatuses');
    yield put(issuesActions.fillIssueStatuses(normalizedData));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

function* onSidebarTabChange({ payload }: { payload: string }): Generator<*, *, *> {
  try {
    const tab: string = payload;
    const recentIssueIds: Array<Id> = yield select(
      getResourceIds('issues', 'recentIssues'),
    );
    if (tab === 'recent' && recentIssueIds.length === 0) {
      yield fork(fetchRecentIssues);
    }
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchSidebarTabChange(): Generator<*, *, *> {
  yield takeEvery(types.SET_SIDEBAR_TYPE, onSidebarTabChange);
}


function* handleIssueFiltersChange(): Generator<*, *, *> {
  yield call(delay, 500);
  yield put(issuesActions.fetchIssuesRequest({ startIndex: 0, stopIndex: 10, search: true }));
  const filters: IssueFilters = yield select(getIssuesFilters);
  yield call(setToStorage, 'lastFiltersSelected', filters);
}

export function* watchFiltersChange(): Generator<*, *, *> {
  yield takeLatest(
    [types.SET_ISSUES_SEARCH_VALUE, types.SET_ISSUES_FILTER],
    handleIssueFiltersChange,
  );
}

export function* issueSelectFlow({ payload, meta }: SelectIssueAction): Generator<*, *, *> {
  const issueViewTab = yield select(getIssueViewTab);
  if (payload) {
    yield fork(getIssueTransitions, payload.id);
    yield fork(getIssueComments, payload.id);
    if (payload) {
      const issueKey = payload.key;
      ipcRenderer.send('select-issue', issueKey);
    }
  }
  if (meta && issueViewTab === 'Worklogs') {
    yield call(delay, 500);
    const worklogEl = document.querySelector(`#worklog-${meta.id}`);
    if (worklogEl) {
      worklogEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

export function* watchIssueSelect(): Generator<*, void, *> {
  yield takeEvery(types.SELECT_ISSUE, issueSelectFlow);
}

export function* transitionIssueFlow(): Generator<*, void, *> {
  try {
    while (true) {
      const { payload, meta } = yield take(types.TRANSITION_ISSUE_REQUEST);
      const issue = meta;
      const transition = payload;
      yield call(Api.transitionIssue, issue.id, transition.id);
      yield put(issuesActions.setIssueStatus(transition.to, issue));
      const newIssue = {
        ...issue,
        fields: {
          ...issue.fields,
          status: transition.to,
        },
      };
      yield put(issuesActions.selectIssue(newIssue));
      yield call(
        notify,
        '',
        `Moved issue ${issue.key} to ${transition.to.name}`,
      );
    }
  } catch (err) {
    yield call(
      notify,
      '',
      'Issue transition failed. Probably no permission',
    );
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* assignIssueFlow(): Generator<*, void, *> {
  try {
    while (true) {
      const { payload } = yield take(types.ASSIGN_ISSUE_REQEST);
      const issue = payload;
      const userData = yield select(getUserData);
      yield call(
        infoLog,
        `assigning issue ${issue.key} to self (${userData.key})`,
      );
      yield call(Api.assignIssue, { issueKey: issue.key, assignee: userData.key });
      yield call(
        infoLog,
        `succesfully assigned issue ${issue.key} to self (${userData.key})`,
      );
      yield put(issuesActions.setIssueAssignee(userData, issue));
      const newIssue = {
        ...issue,
        fields: {
          ...issue.fields,
          assignee: userData,
        },
      };
      yield put(issuesActions.selectIssue(newIssue));
      yield call(
        notify,
        '',
        `${issue.key} is assigned to you`,
      );
    }
  } catch (err) {
    yield call(
      notify,
      '',
      'Cannot assign issue. Probably no permission',
    );
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* fetchIssueFields(): Generator<*, void, *> {
  try {
    yield call(infoLog, 'fetching issue fields');
    const issueFields = yield call(Api.fetchIssueFields);
    yield call(infoLog, 'got issue fields', issueFields);
    yield put(issuesActions.fillIssueFields(issueFields));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* fetchEpics(): Generator<*, void, *> {
  try {
    yield call(infoLog, 'fetching epics');
    const { issues } = yield call(Api.fetchEpics);
    yield call(infoLog, 'got epics', issues);
    const normalizedEpics = yield call(normalizePayload, issues, 'epics');
    yield put(issuesActions.fillEpics(normalizedEpics));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}


export function* addIssueCommentFlow(): Generator<*, void, *> {
  try {
    while (true) {
      const { payload, meta }: CommentRequestAction = yield take(types.COMMENT_REQUEST);
      yield call(infoLog, 'adding comment', payload, meta);
      yield put(issuesActions.setCommentsAdding(true));
      const opts = {
        issueId: meta.id,
        comment: {
          body: payload,
        },
      };
      const newComment = yield call(Api.addComment, opts);
      yield call(infoLog, 'comment added', newComment);
      const comments = yield select(getComments);
      const newComments = [
        ...comments,
        newComment,
      ];
      yield put(issuesActions.fillComments(newComments));
      yield put(issuesActions.setCommentsAdding(false));
    }
  } catch (err) {
    yield put(issuesActions.setCommentsAdding(false));
    yield call(notify, '', 'failed to add comment');
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

function getNewIssueChannelListener(channel) {
  return function* listenNewIssue() {
    while (true) {
      const { payload } = yield take(channel);
      try {
        const issueKey = payload[0];
        const issue = yield call(Api.fetchIssueByKey, issueKey);
        const totalCountIssues = yield select(state => state.issues.meta.totalCount);
        yield put(issuesActions.addIssues({
          map: {
            [issue.id]: issue,
          },
          ids: [issue.id],
        }));
        yield put(issuesActions.setIssuesTotalCount(totalCountIssues + 1));
        yield put(issuesActions.selectIssue(issue));
        yield call(
          notify,
          '',
          `${issue.key} was created`,
        );
      } catch (err) {
        Raven.captureException(err);
      }
    }
  };
}

export function* createIpcNewIssueListener(): void {
  const newIssueChannel = yield call(createIpcChannel, 'newIssue');
  yield fork(getNewIssueChannelListener(newIssueChannel));
}
