import { put, takeEvery } from 'redux-saga/effects';
import * as types from '../constants/';

function* onTimerStop() {
  yield put({
    type: types.SET_SHOW_TRACKING_VIEW,
    payload: false,
  });
}

export function* watchStopTimer() {
  yield takeEvery(types.STOP_TIMER, onTimerStop);
}

function* onSidebarTabChange() {
  yield put({
    type: types.SET_SHOW_SIDEBAR_FILTERS,
    payload: false,
  });
}

export function* watchChangeSidebarTab() {
  yield takeEvery(types.SET_SIDEBAR_TYPE, onSidebarTabChange);
}

