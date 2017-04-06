import { delay } from 'redux-saga';
import { takeLatest, take, fork, throttle, put, call, select } from 'redux-saga/effects';
import { normalize } from 'normalizr';
import {
  fetchIssues, fetchIssue,
  fetchSearchIssues, fetchRecentIssues,
  fetchWorklogs,
  fetchIssueTypes,
  fetchIssueStatuses,
} from 'api';
import * as types from '../constants/';
import { getAllIssues } from '../selectors';
import { issueSchema, issueTypeSchema, issueStatusSchema } from '../schemas/';


function* storeIssues({ issues, fillIssuesType, fillWorklogsType }) {
  const normalizedData = normalize(issues, [issueSchema]);
  console.log('storeIssues', issues);
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


function* storeIssuesTypes({ issueTypes }) {
  const normalizedData = normalize(issueTypes, [issueTypeSchema]);
  normalizedData.result.forEach(id => normalizedData.entities.issueTypes[id].checked = false);
  const issuesIds =
          normalizedData.result.filter(id => !(normalizedData.entities.issueTypes[id].subtask));
  const subIssuesIds =
          normalizedData.result.filter(id => (normalizedData.entities.issueTypes[id].subtask));
  yield put({
    type: types.FILL_ISSUES_ALL_TYPES,
    payload: {
      map: normalizedData.entities.issueTypes,
      issuesIds,
      subIssuesIds,
    },
  });
}

function* storeIssuesStatuses({ issueStatuses }) {
  const normalizedData = normalize(issueStatuses, [issueStatusSchema]);
  normalizedData.result.forEach(id => normalizedData.entities.issueStatus[id].checked = false);
  yield put({
    type: types.FILL_ISSUES_ALL_STATUSES,
    payload: {
      map: normalizedData.entities.issueStatus,
      statusCategories: normalizedData.entities.issueStatusCategory,
      ids: normalizedData.result,
    },
  });
}


function* getRecentIssues() {
  yield put({ type: types.SET_RECENT_ISSUES_FETCH_STATE, payload: true });

  const currentProject = yield select(state => state.projects.meta.selectedProjectId);
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

function* getIssueTypes() {
  yield put({ type: types.SET_ISSUES_ALL_TYPES_FETCH_STATE, payload: true });

  const issueTypes = yield call(fetchIssueTypes);

  yield storeIssuesTypes({
    issueTypes,
  });

  yield put({ type: types.SET_ISSUES_ALL_TYPES_FETCH_STATE, payload: false });
}

function* getIssueStatuses() {
  yield put({ type: types.SET_ISSUES_ALL_STATUSES_FETCH_STATE, payload: true });

  const issueStatuses = yield call(fetchIssueStatuses);

  yield storeIssuesStatuses({
    issueStatuses,
  });

  yield put({ type: types.SET_ISSUES_ALL_STATUSES_FETCH_STATE, payload: false });
}

function* searchIssues() {
  yield put({ type: types.SET_SEARCH_ISSUES_FETCH_STATE, payload: true });
  yield call(delay, 500);

  const currentProject = yield select(state => state.projects.meta.selectedProjectId);
  const projectKey = yield select(state => state.projects.byId.get(currentProject).get('key'));
  const searchValue = yield select(state => state.issues.meta.searchValue);

  let issues = yield call(fetchSearchIssues, { currentProject, projectKey, searchValue });
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
    fillIssuesType: types.FILL_SEARCH_ISSUES,
    fillWorklogsType: types.FILL_WORKLOGS,
  });

  yield put({ type: types.SET_SEARCH_ISSUES_FETCH_STATE, payload: false });
}

function* getIssues({ pagination: { stopIndex, resolve } }) {
  yield put({ type: types.SET_ISSUES_FETCH_STATE, payload: true });

  const totalCount = yield select(state => state.issues.meta.totalCount);
  if (!totalCount) {
    // Fake count
    yield put({ type: types.SET_ISSUES_COUNT, payload: 10 });
  }

  const currentProject = yield select(state => state.projects.meta.selectedProjectId);
  const fetched = yield select(state => state.issues.meta.fetched);
  const startIndex = yield select(state => state.issues.meta.lastStopIndex);
  const typeFiltresId = yield select(state => state.issues.meta.issueCurrentCriteriaFilter_Type);
  const statusFiltresId = yield select(state =>
    state.issues.meta.issueCurrentCriteriaFilter_Status);
  const assigneeFiltresId = yield select(state =>
    state.issues.meta.issueCurrentCriteriaFilter_Assignee);
  const assigneeFiltresMap = yield select(state =>
    state.issues.meta.issuesCriteriaOptions_Assignee);

  const assigneeFiltresEmail = assigneeFiltresId.map(id => assigneeFiltresMap[id].field);
  const newStopIndex = stopIndex + 30;
  yield put({ type: types.SET_LAST_STOP_INDEX, payload: newStopIndex });
  const response = yield call(fetchIssues, {
    startIndex,
    stopIndex: newStopIndex,
    currentProject,
    typeFiltresId,
    statusFiltresId,
    assigneeFiltresEmail,
  });
  let { issues } = response;
  const { total } = response;
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
    fillIssuesType: types.FILL_ISSUES,
    fillWorklogsType: types.FILL_WORKLOGS,
  });

  if (!fetched) {
    yield put({ type: types.SET_ISSUES_FETCHED_STATE, payload: true });
  }
  if (resolve) {
    resolve();
  }
  yield put({ type: types.SET_ISSUES_COUNT, payload: total });
  yield put({ type: types.SET_ISSUES_FETCH_STATE, payload: false });
}


function* getIssue(issueId) {
  try {
    const response = yield call(fetchIssue, issueId);
    yield storeIssues({
      issues: [response],
      fillIssuesType: types.FILL_ISSUES,
      fillWorklogsType: types.FILL_WORKLOGS,
    });
  } catch (err) {
    console.log(err);
  }
}


function* findSelectedIndex({ payload }) {
  if (payload === 'All') {
    const selectedIssueId = yield select(state => state.issues.meta.selectedIssueId);
    const allIssues = yield select(getAllIssues);
    const index = allIssues.findIndex(i => i.get('id') === selectedIssueId);
    yield put({ type: types.SET_SELECTED_INDEX, payload: index });
  }
}

function* getIssuesAfterFiltersSelection() {
  yield put({
    type: types.FETCH_FILTER_ISSUES_REQUEST,
    pagination: { startIndex: 0, stopIndex: 50 },
    resolve: false,
  });
}

export function* watchGetIssues() {
  yield throttle(2000, types.FETCH_ISSUES_REQUEST, getIssues);
}

export function* watchFilterIssues() {
  yield takeLatest(types.FETCH_FILTER_ISSUES_REQUEST, getIssues);
}

export function* watchGetIssue() {
  while (true) {
    const { payload } = yield take(types.FETCH_ISSUE_REQUEST);
    yield fork(getIssue, payload);
  }
}

export function* watchIssuesCriteriaFilter() {
  yield takeLatest(types.SET_ISSUES_CRITERIA_FILTER, getIssuesAfterFiltersSelection);
}

export function* watchIssuesCriteriaFilterDelete() {
  yield takeLatest(types.DELETE_ISSUES_CRITERIA_FILTER, getIssuesAfterFiltersSelection);
}

export function* watchSearchIssues() {
  yield takeLatest(types.FETCH_SEARCH_ISSUES_REQUEST, searchIssues);
}

export function* watchRecentIssues() {
  yield throttle(2000, types.FETCH_RECENT_ISSUES_REQUEST, getRecentIssues);
}

export function* watchChangeSidebar() {
  yield takeLatest(types.SET_SIDEBAR_TYPE, findSelectedIndex);
}

export function* watchGetIssueTypes() {
  yield takeLatest(types.FETCH_ISSUES_ALL_TYPES_REQUEST, getIssueTypes);
}

export function* watchGetIssueStatuses() {
  yield takeLatest(types.FETCH_ISSUES_ALL_STATUSES_REQUEST, getIssueStatuses);
}
