import { take, put, call, cps, select, takeLatest } from 'redux-saga/effects';
import { normalize } from 'normalizr';
import storage from 'electron-json-storage';

import { fetchProjects, fetchAllBoards, fetchSprints } from 'api';
import * as types from '../constants/';
import { projectSchema, boardSchema, sprintsSchema } from '../schemas/';
import { getFromStorage } from './helper';
import { fetchIssues, fetchRecentIssues, fetchIssuesAllTypes, fetchIssuesAllStatuses } from '../actions/issues';


export function* getProjects() {
  while (true) {
    const { selectLastSelectedProject } = yield take(types.FETCH_PROJECTS_REQUEST);
    yield put({ type: types.SET_PROJECTS_FETCH_STATE, payload: true });

    let selectedFiltersType = yield getFromStorage('issueCurrentCriteriaFilterType');
    selectedFiltersType =
      Object.keys(selectedFiltersType).length ? selectedFiltersType : [];
    let selectedFiltersStatus = yield getFromStorage('issueCurrentCriteriaFilterStatus');
    selectedFiltersStatus =
      Object.keys(selectedFiltersStatus).length ? selectedFiltersStatus : [];
    let selectedFiltersAssignee = yield getFromStorage('issueCurrentCriteriaFilterAssignee');
    selectedFiltersAssignee =
      Object.keys(selectedFiltersAssignee).length ? selectedFiltersAssignee : [];

    yield put({
      type: types.SET_SAVED_ISSUES_CRITERIA_FILTER,
      payload: {
        type: selectedFiltersType,
        status: selectedFiltersStatus,
        assignee: selectedFiltersAssignee,
      },
    });

    let projects = [];
    try {
      projects = yield call(fetchProjects);
    } catch (err) {
      console.log(err);
    }
    let boards;
    try {
      boards = yield call(fetchAllBoards);
      boards = boards.values;
    } catch (err) {
      console.log(err);
    }

    if (projects.length || boards.length) {
      const normalizedBoardsData = normalize(boards, [boardSchema]);
      const normalizedProjectData = normalize(projects, [projectSchema]);
      const { scrumBoards, kanbanBoards } = normalizedBoardsData.result.reduce(
        (filter, id) => (
          normalizedBoardsData.entities.boards[id].type === 'scrum'
            ? filter.scrumBoards.push(id)
            : filter.kanbanBoards.push(id)
          ) && filter,
        { scrumBoards: [], kanbanBoards: [] },
      );
      yield put({
        type: types.FILL_PROJECTS,
        payload: {
          map: normalizedProjectData.entities.projects,
          ids: normalizedProjectData.result,
          boardsMap: normalizedBoardsData.entities.boards,
          scrumBoardsIds: scrumBoards,
          kanbanBoardsIds: kanbanBoards,
        },
      });
      if (selectLastSelectedProject && Object.keys(selectLastSelectedProject).length) {
        const selectedProject = yield getFromStorage('lastProject');
        const host = yield select(state => state.profile.host);
        let type;
        let projectId;
        let sprintId;
        if (typeof selectedProject[host] === 'string') {
          type = 'project';
          projectId = selectedProject[host];
        } else {
          type = selectedProject[host].type;
          projectId = selectedProject[host].id;
          sprintId = (type === 'scrum') && selectedProject[host].sprint;
        }
        if (selectedProject[host]) {
          yield put({
            type: types.SELECT_PROJECT,
            payload: projectId,
            meta: type,
          });
          if (sprintId) {
            yield take(types.FILL_SPRINTS);
            yield put({
              type: types.SELECT_SPRINT,
              payload: sprintId,
            });
          }
          yield put(fetchIssues());
          yield put(fetchIssuesAllTypes());
          yield put(fetchIssuesAllStatuses());
          yield put(fetchRecentIssues());
        }
      }
    }

    yield put({ type: types.SET_PROJECTS_FETCHED_STATE, payload: true });
    yield put({ type: types.SET_PROJECTS_FETCH_STATE, payload: false });
  }
}

export function* onSelectProject() {
  while (true) {
    const { payload, meta } = yield take(types.SELECT_PROJECT);

    if (meta === 'scrum') yield put({ type: types.FETCH_SPRINTS_FOR_BOARD });

    const host = yield select(state => state.profile.host);
    const data = yield cps(storage.get, 'lastProject');

    storage.set('lastProject', { ...data, [host]: { type: meta, id: payload, sprint: '' } });
  }
}

function* storeSprints({ sprints }) {
  const normalizedData = normalize(sprints, [sprintsSchema]);
  yield put({
    type: types.FILL_SPRINTS,
    payload: {
      map: normalizedData.entities.sprints,
      ids: normalizedData.result,
    },
  });
}

function* getSprints() {
  yield put({ type: types.SET_SPRINTS_FOR_BOARD_FETCH_STATE, payload: true });
  const boardId = yield select(state => state.projects.meta.selectedProjectId);
  const sprints = yield call(fetchSprints, { boardId });
  yield storeSprints({
    sprints: sprints.values,
  });
  yield put({ type: types.SET_SPRINTS_FOR_BOARD_FETCH_STATE, payload: false });
}

export function* whatchBoardSelection() {
  yield takeLatest(types.FETCH_SPRINTS_FOR_BOARD, getSprints);
}

export function* onSelectSprint() {
  while (true) {
    const { payload } = yield take(types.SELECT_SPRINT);

    const host = yield select(state => state.profile.host);
    const data = yield cps(storage.get, 'lastProject');
    storage.set('lastProject', { ...data, [host]: { ...data[host], sprint: payload } });
  }
}
