import React from 'react';
import { take, put, call } from 'redux-saga/effects';
import { uiActions, types } from 'actions';

export function* notify(message = '', title = '', level = 'normal', icon = 'bellIcon') {
  const newFlag = {
    title,
    appearance: level,
    description: message,
    icon,
  };
  yield put(uiActions.addFlag(newFlag));
}

export function* throwError(err) {
  console.error(err); // eslint-disable-line
  // TODO
  // yield call(notify, 'unexpected error in runtime', 'Error in runtime', 'normal', 'errorIcon');
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
