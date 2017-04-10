import { take, put, call, cps, select } from 'redux-saga/effects';
import { normalize } from 'normalizr';
import storage from 'electron-json-storage';

import { fetchProjects } from 'api';
import * as types from '../constants/';
import { projectSchema } from '../schemas/';
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

    if (projects.length) {
      const normalizedData = normalize(projects, [projectSchema]);
      yield put({
        type: types.FILL_PROJECTS,
        payload: {
          map: normalizedData.entities.projects,
          ids: normalizedData.result,
        },
      });
      if (selectLastSelectedProject) {
        const selectedProject = yield getFromStorage('lastProject');
        const host = yield select(state => state.profile.host);
        if (selectedProject[host]) {
          yield put({ type: types.SELECT_PROJECT, payload: selectedProject[host] });
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
    const { payload } = yield take(types.SELECT_PROJECT);
    const host = yield select(state => state.profile.host);
    const data = yield cps(storage.get, 'lastProject');
    storage.set('lastProject', { ...data, [host]: payload });
  }
}
