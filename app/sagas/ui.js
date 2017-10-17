import { take, put } from 'redux-saga/effects';
import { uiActions, types } from 'actions';

export function* throwError(err) {
  console.log('throwError', err);
}

export function* watchSidebarTypeChange(): Generator<*, *, *> {
  while (true) {
    yield take(types.SET_SIDEBAR_TYPE);
    yield put(uiActions.setSidebarFiltersOpen(false));
  }
}

export function* watchSelectIssue(): Generator<*, *, *> {
  while (true) {
    yield take(types.SELECT_ISSUE);
    yield put(uiActions.setIssueViewTab('Details'));
  }
}
