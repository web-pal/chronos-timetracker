// @flow
import { call, take, select, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import Raven from 'raven-js';
import * as Api from 'api';
import { types, worklogsActions, uiActions } from 'actions';
import { getSelectedIssueId } from 'selectors';
import moment from 'moment';

import { getFromStorage, setToStorage } from './storage';
import { throwError, notify } from './ui';
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
      adjustEstimate: 'auto',
      worklog: {
        timeSpentSeconds: number,
        comment: string,
      },
    } = {
      issueId,
      adjustEstimate: 'auto',
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
    yield call(notify, '', 'Worklog is uploaded');
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

export function* getAdditionalWorklogsForIssues(incompleteIssues: any): Generator<*, *, *> {
  try {
    const worklogs = yield call(Api.fetchWorklogs, incompleteIssues);
    const issues = incompleteIssues.map((issue) => {
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
    return issues;
  } catch (err) {
    yield call(throwError(err));
    Raven.captureException(err);
    return incompleteIssues;
  }
}

export function* addManualWorklogFlow(): Generator<*, *, *> {
  try {
    while (true) {
      const { payload } = yield take(types.ADD_MANUAL_WORKLOG_REQUEST);
      yield put(worklogsActions.setAddWorklogFetching(true));
      const issueId = yield select(getSelectedIssueId);
      const { comment, startTime, endTime, date } = payload;
      const timeSpentSeconds = endTime.diff(startTime, 's');
      const jiraUploadOptions: {
        issueId: Id,
          adjustEstimate: 'auto',
          worklog: {
            timeSpentSeconds: number,
              comment: string,
          },
      } = {
        issueId,
        adjustEstimate: 'auto',
        worklog: {
          started: moment(date).utc().format().replace('Z', '.000+0000'),
          timeSpentSeconds,
          comment,
        },
      };
      yield call(Api.addWorklog, jiraUploadOptions);
      yield put(worklogsActions.setAddWorklogFetching(false));
      yield put(uiActions.setWorklogModalOpen(false));
      yield call(delay, 1000);
      yield call(notify, '', 'Manual worklog succesfully added');
    }
  } catch (err) {
    yield put(worklogsActions.setAddWorklogFetching(false));
    yield call(throwError, err);
    Raven.captureException(err);
  }
}
