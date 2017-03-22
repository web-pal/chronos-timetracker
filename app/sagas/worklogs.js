import fs from 'fs';
import path from 'path';
import { take, takeLatest, fork, select, put, call, cps } from 'redux-saga/effects';

import { remote } from 'electron';

import {
  jiraUploadWorklog, chronosBackendUploadWorklog,
  signUploadUrlForS3Bucket, uploadScreenshotOnS3Bucket,
} from 'api';

import * as types from '../constants/';
import { getRecentWorklogsGroupedByDate } from '../selectors/worklogs';
import { selectWorklog } from '../actions/worklogs';


export function* findAndSelectWorlogByIssueId({ issueId }) {
  const recentWorkLogsGroupedByDate = yield select(getRecentWorklogsGroupedByDate);
  const recentWorkLogs = new Immutable.OrderedSet()
    .concat(...recentWorkLogsGroupedByDate.map(day => day.worklogs));
  const foundWorklog = recentWorkLogs.find(w => w.get('issueId') === issueId);
  if (foundWorklog) {
    yield put(selectWorklog(foundWorklog.get('id')));
  } else {
    yield put(selectWorklog(null));
  }
}

export function* uploadWorklog({ issueId, timeSpentSeconds, comment }) {
  yield put({ type: types.SET_WORKLOG_UPLOAD_STATE, payload: true });
  remote.getGlobal('sharedObj').uploading = true;

  const screensShot = yield select(state => state.timer.currentScreenShotsList.toArray());
  const { id } = yield call(
    jiraUploadWorklog, { issueId, worklog: { timeSpentSeconds, comment } },
  );
  yield call(
    chronosBackendUploadWorklog, {
      worklogId: id,
      issueId,
      timeSpentSeconds,
      comment,
      screensShot: screensShot.map(s => ({ name: s })),
    },
  );
  yield put({ type: types.CLEAR_CURRENT_SCREENSHOTS_LIST });
  yield put({ type: types.SET_WORKLOG_UPLOAD_STATE, payload: false });
  remote.getGlobal('sharedObj').uploading = false;
}

export function* watchSelectWorklogs() {
  yield takeLatest(
    types.SELECT_WORKLOG_BY_ISSUE_ID,
    findAndSelectWorlogByIssueId,
  );
}

export function* uploadScreenshot({ screenshotTime, lastScreenshotPath }) {
  yield put({ type: types.SET_LAST_SCREENSHOT_TIME, payload: screenshotTime });

  const { url } = yield call(signUploadUrlForS3Bucket, lastScreenshotPath);
  const image = yield cps(fs.readFile, lastScreenshotPath);

  yield uploadScreenshotOnS3Bucket({ url, image });

  yield put({
    type: types.ADD_SCREENSHOT_TO_CURRENT_LIST,
    payload: path.basename(lastScreenshotPath),
  });
  yield cps(fs.unlink, lastScreenshotPath);
}

export function* watchUploadScreenshot() {
  while (true) {
    const { screenshotInfo } = yield take(types.UPLOAD_SCREENSHOT_REQUEST);
    yield fork(uploadScreenshot, screenshotInfo);
  }
}

export function* rejectScreenshot(screenshotPath) {
  const lastScreenshotTime = yield select(state => state.timer.lastScreenshotTime);
  yield put({ type: types.SET_TIME, payload: lastScreenshotTime });
  yield cps(fs.unlink, screenshotPath);
}

export function* watchRejectScreenshot() {
  while (true) {
    const { screenshotPath } = yield take(types.REJECT_SCREENSHOT_REQUEST);
    yield fork(rejectScreenshot, screenshotPath);
  }
}
