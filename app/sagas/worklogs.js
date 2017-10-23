// @flow
import { call, take, select, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import Raven from 'raven-js';
import * as Api from 'api';
import { types, worklogsActions, uiActions, issuesActions } from 'actions';
import { getSelectedIssueId, getUserData } from 'selectors';
import moment from 'moment';
import { stj } from 'time-util';

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
    const started = moment().utc().format().replace('Z', '.000+0000');
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
        started,
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
    yield put(issuesActions.addWorklogToIssue(worklog, issueId));
  } catch (err) {
    const started = moment().utc().format().replace('Z', '.000+0000');
    yield call(saveWorklogAsOffline, {
      issueId,
      worklog: {
        started,
        timeSpentSeconds,
        comment,
      },
    });
    yield call(notify, '', 'Failed to upload worklog');
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
      const started = moment(date).utc().format().replace('Z', '.000+0000');
      const timeSpentSeconds = endTime.diff(startTime, 's');
      const self = yield select(getUserData);
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
          started,
          timeSpentSeconds,
          comment,
        },
      };
      yield call(Api.addWorklog, jiraUploadOptions);
      yield put(worklogsActions.setAddWorklogFetching(false));
      yield put(uiActions.setWorklogModalOpen(false));
      yield call(delay, 1000);
      yield call(notify, '', 'Manual worklog succesfully added');
      const newWorklog = {
        self: '',
        author: self,
        updateAuthor: self,
        comment,
        created: started,
        updated: started,
        started,
        timeSpent: stj(timeSpentSeconds, 'h[h]m[m]'),
        timeSpentSeconds,
        id: String(Date.now()),
        issueId,
      };
      yield put(issuesActions.addWorklogToIssue(newWorklog, issueId));
    }
  } catch (err) {
    yield put(worklogsActions.setAddWorklogFetching(false));
    yield call(throwError, err);
    Raven.captureException(err);
  }
}
