// @flow
import { put, call, select, takeLatest, take, fork } from 'redux-saga/effects';
import createActionCreators from 'redux-resource-action-creators';
import Raven from 'raven-js';
import normalizePayload from 'normalize-util';

import { types, projectsActions, issuesActions } from 'actions';
import { getSelectedBoardId, getSidebarType } from 'selectors';
import * as Api from 'api';

import { setToStorage, getFromStorage } from './storage';

import { fetchRecentIssues, fetchIssueTypes, fetchIssueStatuses } from './issues';
import {
  fetchBoards,
} from './boards';
import { throwError, notify, infoLog } from './ui';

import type { SelectProjectAction, Id, SidebarType, ProjectType, FlagAction } from '../types';


export function* fetchProjects(): Generator<*, *, *> {
  try {
    const actions = createActionCreators('read', {
      resourceName: 'projects',
      request: 'allProjects',
      list: 'allProjects',
    });
    yield put(actions.pending());
    const projects = yield call(Api.fetchProjects);
    yield put(actions.succeeded({
      resources: projects,
    }));
    const lastProjectSelected: Id | null = yield call(getFromStorage, 'lastProjectSelected');
    const lastProjectSelectedType: ProjectType | null = yield call(getFromStorage, 'lastProjectSelectedType');
    if (lastProjectSelected) {
      yield put(projectsActions.selectProject(lastProjectSelected, lastProjectSelectedType || 'project'));
    }
  } catch (err) {
    yield call(notify, '', 'Failed to load projects, check your permissions');
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchFetchProjectsRequest(): Generator<*, *, *> {
  yield takeLatest(types.FETCH_PROJECTS_REQUEST, fetchProjects);
}

export function* fetchSprints(): Generator<*, *, *> {
  try {
    // yield put({ type: types.SET_SPRINTS_FOR_BOARD_FETCH_STATE, payload: true });
    const selectedBoardId = yield select(getSelectedBoardId);
    const sprints = yield call(fetchSprints, { selectedBoardId });
    const normalizedSprints = normalizePayload(sprints, 'sprints');
    yield put(projectsActions.fillSprints(normalizedSprints));
    // yield put({ type: types.SET_SPRINTS_FOR_BOARD_FETCH_STATE, payload: false });
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchFetchSprintsRequest(): Generator<*, *, *> {
  yield takeLatest(types.FETCH_SPRINTS_REQUEST, fetchSprints);
}

export function* watchProjectSelection(): Generator<*, *, *> {
  while (true) {
    const { payload, meta }: SelectProjectAction = yield take(types.SELECT_PROJECT);
    yield call(infoLog, `project ${payload} is selected now`);
    yield fork(fetchIssueTypes);
    yield fork(fetchIssueStatuses);
    yield call(setToStorage, 'lastProjectSelected', payload);
    yield call(setToStorage, 'lastProjectSelectedType', meta);
    yield put(issuesActions.selectIssue(null));
    yield put(issuesActions.clearIssues());
    yield put(issuesActions.fetchIssuesRequest());
    const sidebarType: SidebarType = yield select(getSidebarType);
    if (sidebarType === 'recent') {
      yield fork(fetchRecentIssues);
    }
  }
}
