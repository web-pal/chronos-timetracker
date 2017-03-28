import fs from 'fs';
import path from 'path';
import storage from 'electron-json-storage';
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

export function* uploadWorklog({
  issueId,
  timeSpentSeconds,
  comment,
  activityValue,
  screens,
  worklog_id,
}, offlineMode = false) {
  remote.getGlobal('sharedObj').uploading = true;
  let activity = activityValue;
  let screensShot = screens;
  let worklogId = worklog_id; // eslint-disable-line

  if (!offlineMode) {
    yield put({ type: types.SET_WORKLOG_UPLOAD_STATE, payload: true });
    const currentIdleList = yield select(
      state => state.timer.currentIdleList,
    );
    console.log('currentIdleList', currentIdleList.toJS());

    activity = [...Array(Math.ceil(timeSpentSeconds / 600)).keys()].map((period) => {
      console.log('period', period);
      const idleSec = currentIdleList
        .slice(period * 10, (period + 1) * 10)
        .reduce((a, b) => (a + b), 0) / 1000;
      console.log('idleSec', idleSec);

      return 100 - Math.round((10 * idleSec) / 100);
    });
    console.log('activity', activity);

    screensShot = yield select(
      state => state.worklogs.meta.currentWorklogScreenshots.toArray(),
    );
    screensShot = screensShot.map(s => ({ name: s }));
  }

  let worklog = false;
  if (!worklogId) {
    const jiraWorklogData = {
      issueId,
      worklog: {
        timeSpentSeconds,
        comment,
      },
    };
    try {
      worklog = yield call(
        jiraUploadWorklog, jiraWorklogData,
      );
      worklogId = worklog.id;
    } catch (err) {
      console.log(err);
      let offlineWorklogs = yield cps(storage.get, 'offlineWorklogs');
      if (Object.prototype.toString.call(offlineWorklogs) !== '[object Array]') {
        offlineWorklogs = [];
      }
      offlineWorklogs.push({
        ...jiraWorklogData,
        screensShot,
        activity,
        type: 'jiraUploadWorklog',
      });
      yield cps(storage.set, 'offlineWorklogs', offlineWorklogs);
    }
  }
  if (worklogId) {
    const chronosWorklogData = {
      worklogId,
      issueId,
      timeSpentSeconds,
      comment,
      screensShot,
      activity,
    };
    try {
      yield call(chronosBackendUploadWorklog, chronosWorklogData);
    } catch (err) {
      console.log(err);
      let offlineWorklogs = yield cps(storage.get, 'offlineWorklogs');
      if (Object.prototype.toString.call(offlineWorklogs) !== '[object Array]') {
        offlineWorklogs = [];
      }
      offlineWorklogs.push({ ...chronosWorklogData, type: 'chronosUploadWorklog' });
      yield cps(storage.set, 'offlineWorklogs', offlineWorklogs);
    }
  }
  if (!offlineMode) {
    yield put({ type: types.CLEAR_CURRENT_SCREENSHOTS_LIST });
    yield put({ type: types.CLEAR_CURRENT_IDLE_LIST });
    yield put({ type: types.SET_WORKLOG_UPLOAD_STATE, payload: false });
    yield put({ type: types.FETCH_ISSUE_REQUEST, payload: issueId });
  }
  // Maybe we need to have temporary id
  if (!offlineMode && worklog) {
    yield put({ type: types.ADD_RECENT_WORKLOG, payload: worklog });
  }
  remote.getGlobal('sharedObj').uploading = false;
}

export function* watchSelectWorklogs() {
  yield takeLatest(
    types.SELECT_WORKLOG_BY_ISSUE_ID,
    findAndSelectWorlogByIssueId,
  );
}

export function* uploadScreenshot({ screenshotTime, lastScreenshotPath }) {
  const isOffline = lastScreenshotPath.includes('offline_screens');
  if (!isOffline) {
    yield put({ type: types.SET_LAST_SCREENSHOT_TIME, payload: screenshotTime });
  }

  const fileName = path.basename(lastScreenshotPath);
  let error = false;
  const image = yield cps(fs.readFile, lastScreenshotPath);

  try {
    const { url } = yield call(signUploadUrlForS3Bucket, fileName);
    yield uploadScreenshotOnS3Bucket({ url, image });
  } catch (err) {
    // Most likely there is no internet
    console.log(err);
    error = true;
  }

  if (!isOffline) {
    yield put({
      type: types.ADD_SCREENSHOT_TO_CURRENT_LIST,
      payload: fileName,
    });
  }

  if (error) {
    if (!isOffline) {
      fs.rename(lastScreenshotPath, `${remote.getGlobal('appDir')}/offline_screens/${fileName}`);
    }
  } else {
    yield cps(fs.unlink, lastScreenshotPath);
  }
  return error;
}

export function* uploadOfflineScreenshots() {
  while (true) {
    yield take(types.CHECK_OFFLINE_SCREENSHOTS);
    yield put({ type: types.SET_STATE_CHECK_OFFLINE_SCREENSHOTS, payload: true });
    const images = yield cps(fs.readdir, `${remote.getGlobal('appDir')}/offline_screens/`);
    for (const image of images.filter(i => i.split('.').slice(-1)[0] === 'png')) { // eslint-disable-line
      const error = yield uploadScreenshot(
        { lastScreenshotPath: `${remote.getGlobal('appDir')}/offline_screens/${image}` },
      );
      if (error) {
        break;
      }
    }
    yield put({ type: types.SET_STATE_CHECK_OFFLINE_SCREENSHOTS, payload: false });
  }
}

export function* uploadOfflineWorklogs() {
  while (true) {
    yield take(types.CHECK_OFFLINE_WORKLOGS);
    yield put({ type: types.SET_STATE_CHECK_OFFLINE_WORKLOGS, payload: true });
    let offlineWorklogs = yield cps(storage.get, 'offlineWorklogs');
    if (Object.prototype.toString.call(offlineWorklogs) !== '[object Array]') {
      offlineWorklogs = [];
    }
    let index = 0;
    for (let worklog of offlineWorklogs) { // eslint-disable-line
      const args = {
        issueId: worklog.issueId,
        timeSpentSeconds: worklog.worklog.timeSpentSeconds,
        comment: worklog.comment,
        screens: worklog.screensShot,
        activityValue: worklog.activity,
      };
      if (worklog.type === 'chronosUploadWorklog') {
        args.worklog_id = worklog.id;
      }
      const error = yield uploadWorklog(args, true);
      offlineWorklogs.splice(index, 1);
      if (error) {
        break;
      }
      index += 1;
    }
    yield cps(storage.set, 'offlineWorklogs', offlineWorklogs);
    yield put({ type: types.SET_STATE_CHECK_OFFLINE_WORKLOGS, payload: false });
  }
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
