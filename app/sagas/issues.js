import { delay } from 'redux-saga';
import { takeLatest, throttle, put, call, select } from 'redux-saga/effects';
import { normalize } from 'normalizr';
import { fetchIssues, fetchSearchIssues, fetchRecentIssues, fetchWorklogs } from 'api';
import * as types from '../constants/';
import { issueSchema } from '../schemas/';


function* storeIssues({ issues, fillIssuesType, fillWorklogsType }) {
  const normalizedData = normalize(issues, [issueSchema]);
  yield put({
    type: fillIssuesType,
    payload: {
      map: normalizedData.entities.issues,
      ids: normalizedData.result,
    },
  });
  if (normalizedData.entities.worklogs) {
    yield put({
      type: fillWorklogsType,
      payload: {
        map: normalizedData.entities.worklogs,
        ids: Object.keys(normalizedData.entities.worklogs || {}),
      },
    });
  }
}

function* getRecentIssues() {
  yield put({ type: types.SET_RECENT_ISSUES_FETCH_STATE, payload: true });

  const currentProject = yield select(state => state.projects.meta.selected);
  const worklogAuthor = yield select(state => state.profile.userData.get('key'));

  let { issues } = yield call(fetchRecentIssues, { currentProject, worklogAuthor });
  const incompleteIssues = issues.filter(issue => issue.fields.worklog.total > 20);
  if (incompleteIssues.length) {
    const worklogs = yield call(fetchWorklogs, incompleteIssues);
    issues = issues.map((issue) => {
      const additionalWorklogs = worklogs.filter(w => w.issueId === issue.id);
      if (additionalWorklogs.length) {
        return {
          ...issue,
          fields: {
            ...issue.fields,
            worklog: {
              total: additionalWorklogs.length,
              worklogs: additionalWorklogs,
            },
          },
        };
      }
      return issue;
    });
  }

  yield storeIssues({
    issues,
    fillIssuesType: types.FILL_RECENT_ISSUES,
    fillWorklogsType: types.FILL_RECENT_WORKLOGS,
  });

  yield put({ type: types.SET_RECENT_ISSUES_FETCH_STATE, payload: false });
}

function* searchIssues() {
  yield put({ type: types.SET_SEARCH_ISSUES_FETCH_STATE, payload: true });
  yield call(delay, 500);

  const currentProject = yield select(state => state.projects.meta.selected);
  const projectKey = yield select(state => state.projects.byId.get(currentProject).get('key'));
  const searchValue = yield select(state => state.issues.meta.searchValue);

  const issues = yield call(fetchSearchIssues, { currentProject, projectKey, searchValue });

  yield storeIssues({
    issues,
    fillIssuesType: types.FILL_SEARCH_ISSUES,
    fillWorklogsType: types.FILL_WORKLOGS,
  });

  yield put({ type: types.SET_SEARCH_ISSUES_FETCH_STATE, payload: false });
}

function* getIssues({ pagination: { stopIndex, resolve } }) {
  yield put({ type: types.SET_ISSUES_FETCH_STATE, payload: true });

  const currentProject = yield select(state => state.projects.meta.selected);
  const fetched = yield select(state => state.issues.meta.fetched);
  const startIndex = yield select(state => state.issues.meta.lastStopIndex);
  const newStopIndex = stopIndex + 30;
  yield put({ type: types.SET_LAST_STOP_INDEX, payload: newStopIndex });

  const response = yield call(fetchIssues, { startIndex, stopIndex: newStopIndex, currentProject });

  yield storeIssues({
    issues: response.issues,
    fillIssuesType: types.FILL_ISSUES,
    fillWorklogsType: types.FILL_WORKLOGS,
  });

  if (!fetched) {
    yield put({ type: types.SET_ISSUES_FETCHED_STATE, payload: true });
  }
  if (resolve) {
    resolve();
  }
  yield put({ type: types.SET_ISSUES_COUNT, payload: response.total });
  yield put({ type: types.SET_ISSUES_FETCH_STATE, payload: false });
}


export function* watchGetIssues() {
  yield throttle(2000, types.FETCH_ISSUES_REQUEST, getIssues);
}

export function* watchSearchIssues() {
  yield takeLatest(types.FETCH_SEARCH_ISSUES_REQUEST, searchIssues);
}

export function* watchRecentIssues() {
  yield throttle(2000, types.FETCH_RECENT_ISSUES_REQUEST, getRecentIssues);
}
