import { take, put, call, cps, select } from 'redux-saga/effects';
import { normalize } from 'normalizr';
import storage from 'electron-json-storage';

import { fetchProjects, fetchAllBoards, fetchSprints } from 'api';
import * as types from '../constants/';
import { projectSchema, boardSchema } from '../schemas/';
import { getFromStorage } from './helper';
import { fetchIssues, fetchRecentIssues, fetchIssuesAllTypes, fetchIssuesAllStatuses } from '../actions/issues';


export function* getProjects() {
  while (true) {
    const { selectLastSelectedProject } = yield take(types.FETCH_PROJECTS_REQUEST);
    yield put({ type: types.SET_PROJECTS_FETCH_STATE, payload: true });


    const selectedFiltersType = yield getFromStorage('issueCurrentCriteriaFilterType');
    const selectedFiltersStatus = yield getFromStorage('issueCurrentCriteriaFilterStatus');
    const selectedFiltersAssignee = yield getFromStorage('issueCurrentCriteriaFilterAssignee');
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
    console.log('selectLastSelectedProject', selectLastSelectedProject);
    let boards;
    try {
      boards = yield call(fetchAllBoards);
      boards = boards.values;
    } catch (err) {
      console.log(err);
    }

    console.log('===============');
    console.log('boards', boards);
    console.log('projects', projects);

    let sprintsForBoard3;
    try {
      sprintsForBoard3 = yield call(fetchSprints, { boardId: 3 });
    } catch (err) {
      console.log(err);
    }
    console.log('_________________-fetchSprints', fetchSprints);
    console.log('_________________-', sprintsForBoard3);

    if (projects.length || boards.length) {
      const normalizedBoardsData = normalize(boards, [boardSchema]);
      const normalizedProjectData = normalize(projects, [projectSchema]);

      yield put({
        type: types.FILL_PROJECTS,
        payload: {
          map: normalizedProjectData.entities.projects,
          ids: normalizedProjectData.result,
          boardsMap: normalizedBoardsData.entities.boards,
          boardsIds: normalizedBoardsData.result,
        },
      });
      if (selectLastSelectedProject) {
        const selectedProject = yield getFromStorage('lastProject');
        console.log('--=---selectedProject', selectedProject);
        const host = yield select(state => state.profile.host);
        console.log('--=---payload: selectedProject[host].substr(1),', selectedProject[host].substr(1));
        if (selectedProject[host]) {
          yield put({
            type: types.SELECT_PROJECT,
            payload: selectedProject[host].substr(1),
            meta: selectedProject[host][0] === 'b' ? 'board' : 'project',
          });
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
    const host = yield select(state => state.profile.host);
    const data = yield cps(storage.get, 'lastProject');
    console.log('meta ? board', (meta==='board' ? 'b' : '') + payload);
    storage.set('lastProject', { ...data, [host]: (meta === 'board' ? 'b' : '') + payload });
  }
}
