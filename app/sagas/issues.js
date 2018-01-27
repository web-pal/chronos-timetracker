// @flow
import { delay } from 'redux-saga'; import { call, take, select, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
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
  getSelectedIssueId,
  getSelectedIssue,
  getIssueViewTab,
  getSelectedProjectType,
} from 'selectors';
import { issuesActions, types } from 'actions';
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

function* buildJQLQuery(): Generator<*, string, *> {
  const filters: IssueFilters = yield select(getIssueFilters);
  const typeFilters = filters.type;
  const statusFilters = filters.status;
  const assigneeFilter = filters.assignee[0];
  const selectedProject: Project | null = yield select(getSelectedProject);
  const projectId: string | null = yield select(getSelectedProjectId);
  const projectType: string | null = yield select(getSelectedProjectType);
  const searchValue: string = yield select(getIssuesSearchValue);
  const sprintId: Id = yield select(getSelectedSprintId);
  const projectKey: string | null = selectedProject && selectedProject.key;
  const jql = [
    (projectType === 'project' && projectId ? `project = ${projectId}` : ''),
    ((projectType === 'scrum') && sprintId ? `sprint = ${sprintId}` : ''),
    (searchValue && projectKey ? mapSearchValue(searchValue, projectKey) : ''),
    (typeFilters.length ? `issueType in (${typeFilters.join(',')})` : ''),
    (statusFilters.length ? `status in (${statusFilters.join(',')})` : ''),
    (assigneeFilter ? mapAssignee(assigneeFilter) : ''),
  ].filter(f => !!f).join(' AND ');
  return jql;
}

export function* fetchIssues({
  payload: {
    startIndex,
    stopIndex,
    resolve,
    search,
  },
}: FetchIssuesRequestAction): Generator<*, *, *> {
  try {
    yield call(
      infoLog,
      'started fetchIssues',
    );
    yield put(issuesActions.setIssuesFetching(true));
    if (search) {
      yield put(issuesActions.setIssuesTotalCount(0));
      yield put(issuesActions.clearFoundIssueIds());
    }
    const epicLinkFieldId: string | null = yield select(getFieldIdByName, 'Epic Link');
    const selectedProjectId: string | null = yield select(getSelectedProjectId);
    const selectedProjectType: string | null = yield select(getSelectedProjectType);
    const jql: string = yield call(buildJQLQuery);
    const opts = {
      startIndex,
      stopIndex,
      jql,
      epicLinkFieldId,
      projectId: selectedProjectId,
      projectType: selectedProjectType || 'project',
    };
    const response = yield call(Api.fetchIssues, opts);
    yield call(
      infoLog,
      'fetchIssues response',
      response,
    );
    const incompleteIssues = response.issues.filter(issue => issue.fields.worklog.total > 20);
    const normalizedIssues = yield call(normalizePayload, response.issues, 'issues');
    if (incompleteIssues.length) {
      yield call(
        infoLog,
        'found issues lacking worklogs',
        incompleteIssues,
      );
      const additionalIssues = yield call(getAdditionalWorklogsForIssues, incompleteIssues);
      yield call(
        infoLog,
        'getAdditionalWorklogsForIssues response:',
        additionalIssues,
      );

      merge(normalizedIssues.map, additionalIssues);
      yield call(
        infoLog,
        'filled issues with lacking worklogs: ',
        normalizedIssues.map,
      );
    }
    const selectedIssueId = yield select(getSelectedIssueId);
    if (normalizedIssues.ids.includes(selectedIssueId)) {
      yield put(issuesActions.selectIssue(normalizedIssues.map[selectedIssueId]));
    }
    yield put(issuesActions.setIssuesTotalCount(response.total));
    yield put(issuesActions.addIssues({
      ...normalizedIssues,
      indexedIds:
        normalizedIssues.ids.reduce((acc, id, index) => {
          acc[startIndex + index] = id;
          return acc;
        }, {}),
    }));
    if (search) {
      yield put(issuesActions.fillFoundIssueIds(normalizedIssues.ids));
    } else {
      const foundIssueIds = yield select(getFoundIssueIds);
      if (foundIssueIds.length !== 0) {
        yield put(issuesActions.addFoundIssueIds(normalizedIssues.ids));
      }
    }
    if (resolve) {
      resolve();
    }
    yield put(issuesActions.setIssuesFetching(false));
  } catch (err) {
    yield put(issuesActions.setIssuesFetching(false));
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchFetchIssuesRequest(): Generator<*, *, *> {
  yield takeEvery(types.FETCH_ISSUES_REQUEST, fetchIssues);
}

export function* fetchRecentIssues(): Generator<*, *, *> {
  try {
    yield call(
      infoLog,
      'started fetchRecentIssues',
    );
    yield put(issuesActions.setRecentIssuesFetching(true));
    const selectedProjectId: string | null = yield select(getSelectedProjectId);
    const selectedProjectType: string | null = yield select(getSelectedProjectType);
    const selectedSprintId: Id = yield select(getSelectedSprintId);
    const self: User = yield select(getUserData);
    const opts = {
      projectId: selectedProjectId,
      projectType: selectedProjectType || 'project',
      sprintId: selectedSprintId,
      worklogAuthor: self.key,
    };
    const response = yield call(Api.fetchRecentIssues, opts);
    yield call(
      infoLog,
      'fetchRecentIssues response:',
      response,
    );
    const { issues } = response;

    const incompleteIssues = issues.filter(issue => issue.fields.worklog.total > 20);
    const normalizedIssues = yield call(normalizePayload, issues, 'issues');
    if (incompleteIssues.length) {
      yield call(
        infoLog,
        'found issues lacking worklogs',
        incompleteIssues,
      );
      const additionalIssues = yield call(getAdditionalWorklogsForIssues, incompleteIssues);
      yield call(
        infoLog,
        'getAdditionalWorklogsForIssues response:',
        additionalIssues,
      );

      merge(normalizedIssues.map, additionalIssues);
      yield call(
        infoLog,
        'filled issues with lacking worklogs: ',
        normalizedIssues.map,
      );
    }
    yield put(issuesActions.addIssues(normalizedIssues));
    yield put(issuesActions.fillRecentIssueIds(normalizedIssues.ids));
    /* TODO
    if (showWorklogTypes) {
      const recentWorkLogsIds = yield select(
        state => state.worklogs.meta.recentWorkLogsIds.toArray(),
      );
      const worklogsFromChronosBackend
        = yield call(fetchChronosBackendWorklogs, recentWorkLogsIds);
      yield put({
        type: types.MERGE_WORKLOGS_TYPES,
        payload: worklogsFromChronosBackend.filter(w => w.worklogType),
      });
    }
    */
    yield put(issuesActions.setRecentIssuesFetching(false));
  } catch (err) {
    yield put(issuesActions.setRecentIssuesFetching(false));
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
    const recentIssueIds: Array<Id> = yield select(getRecentIssueIds);
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
  const filters: IssueFilters = yield select(getIssueFilters);
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
