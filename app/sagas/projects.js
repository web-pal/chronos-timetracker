import { take, put, call, select } from 'redux-saga/effects';
import { normalize } from 'normalizr';
import { fetchProjects } from 'api';
import * as types from '../constants/';
import { projectSchema } from '../schemas/';
import { getFromStorage } from './helper';


export function* getProjects() {
  while (true) {
    const { selectLastSelectedProject } = yield take(types.FETCH_PROJECTS_REQUEST);
    yield put({ type: types.SET_PROJECTS_FETCH_STATE, payload: true });
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
        }
      }
    }
    yield put({ type: types.SET_PROJECTS_FETCH_STATE, payload: false });
  }
}
