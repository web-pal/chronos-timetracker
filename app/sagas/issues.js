import { throttle, put, call, select } from 'redux-saga/effects';
import { normalize } from 'normalizr';
import { fetchIssues, fetchSearchIssues } from 'api';
import * as types from '../constants/';
import { issueSchema } from '../schemas/';

function* searchIssues() {
  yield put({ type: types.SET_SEARCH_ISSUES_FETCH_STATE, payload: true });

  const currentProject = yield select(state => state.projects.meta.selected);
  const projectKey = yield select(state => state.projects.byId.get(currentProject).get('key'));
  const searchValue = yield select(state => state.issues.meta.searchValue);

  const issues = yield call(fetchSearchIssues, { currentProject, projectKey, searchValue });
  const normalizedData = normalize(issues, [issueSchema]);
  yield put({
    type: types.FILL_ISSUES_ONLY_MAP,
    payload: {
      map: normalizedData.entities.issues,
      ids: normalizedData.result,
    },
  });
  yield put({ type: types.FILL_SEARCH_ISSUES, payload: normalizedData.result });
  if (normalizedData.entities.worklogs) {
    yield put({
      type: types.FILL_WORKLOGS,
      payload: {
        map: normalizedData.entities.worklogs,
        ids: Object.keys(normalizedData.entities.worklogs || {}),
      },
    });
  }
  yield put({ type: types.SET_SEARCH_ISSUES_FETCH_STATE, payload: false });
}

function* getIssues({ pagination: { stopIndex, resolve } }) {
  yield put({ type: types.SET_ISSUES_FETCH_STATE, payload: true });

  let response = {};
  const currentProject = yield select(state => state.projects.meta.selected);
  const fetched = yield select(state => state.projects.meta.fetched);
  const startIndex = yield select(state => state.issues.meta.lastStopIndex);
  const newStopIndex = stopIndex + 30;
  yield put({ type: types.SET_LAST_STOP_INDEX, payload: newStopIndex });
  try {
    response = yield call(
      fetchIssues,
      { startIndex, stopIndex: newStopIndex, currentProject },
    );
  } catch (err) {
    console.log(err);
  }

  yield put({ type: types.SET_ISSUES_COUNT, payload: response.total });
  const normalizedData = normalize(response.issues, [issueSchema]);
  yield put({
    type: types.FILL_ISSUES,
    payload: {
      map: normalizedData.entities.issues,
      ids: normalizedData.result,
    },
  });
  if (normalizedData.entities.worklogs) {
    yield put({
      type: types.FILL_WORKLOGS,
      payload: {
        map: normalizedData.entities.worklogs,
        ids: Object.keys(normalizedData.entities.worklogs || {}),
      },
    });
  }
  if (!fetched) {
    yield put({ type: types.SET_ISSUES_FETCHED_STATE, payload: true });
  }
  if (resolve) {
    resolve();
  }
  yield put({ type: types.SET_ISSUES_FETCH_STATE, payload: false });
}


export function* watchGetIssues() {
  yield throttle(2000, types.FETCH_ISSUES_REQUEST, getIssues);
}

export function* watchSearchIssues() {
  yield throttle(3000, types.FETCH_SEARCH_ISSUES_REQUEST, searchIssues);
}
