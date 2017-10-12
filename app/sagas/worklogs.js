// @flow
import { call } from 'redux-saga/effects';
import Raven from 'raven-js';
import * as Api from 'api';

import { getFromStorage, setToStorage } from './storage';
import { throwError } from './ui';
import type { Id, Worklog } from '../types';

export function* saveWorklogAsOffline(worklog: any): Generator<*, *, *> {
  let offlineWorklogs = yield call(getFromStorage, 'offlineWorklogs');
  if (!Array.isArray(offlineWorklogs)) {
    offlineWorklogs = [];
  }
  offlineWorklogs.push(worklog);
  yield call(setToStorage, 'offlineWorklogs', offlineWorklogs);
}

type UploadWorklogOptions = {
  issueId: Id,
  timeSpentSeconds: number,
  screenshotsPeriod: number,
  worklogType: any,
  comment: string,
  screenshots: any,
  activity: any,
  keepedIdles: any,
};

export function* uploadWorklog({
  issueId,
  timeSpentSeconds,
  comment,
  screenshotsPeriod,
  worklogType,
  screenshots,
  activity,
  keepedIdles,
}: UploadWorklogOptions): Generator<*, *, *> {
  try {
    const jiraUploadOptions: {
      issueId: Id,
      worklog: {
        timeSpentSeconds: number,
        comment: string,
      },
    } = {
      issueId,
      worklog: {
        timeSpentSeconds,
        comment,
      },
    };

    const worklog: Worklog = yield call(Api.jiraUploadWorklog, jiraUploadOptions);
    const worklogId: Id = worklog.id;
    const backendUploadOptions = {
      worklogId,
      issueId,
      timeSpentSeconds,
      screenshotsPeriod,
      worklogType,
      comment,
      screenshots,
      activity,
      keepedIdles,
    };
    yield call(Api.chronosBackendUploadWorklog, backendUploadOptions);
  } catch (err) {
    yield call(saveWorklogAsOffline, {
      issueId,
      worklog: {
        timeSpentSeconds,
        comment,
      },
    });
    yield call(throwError, err);
    Raven.captureException(err);
  }
}
