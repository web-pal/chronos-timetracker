// @flow
import { call, take, select, put, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import Raven from 'raven-js';
import * as Api from 'api';
import { types, worklogsActions, uiActions, issuesActions } from 'actions';
import { getSelectedIssueId, getUserData } from 'selectors';
import moment from 'moment';
import { stj } from 'time-util';
import mixpanel from 'mixpanel-browser';

import { getFromStorage, setToStorage } from './storage';
import { throwError, notify, infoLog } from './ui';
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

export function* uploadWorklog(options: UploadWorklogOptions): Generator<*, *, *> {
  try {
    yield call(
      infoLog,
      'started uploading worklog with options:',
      options,
    );
    const {
      issueId,
      timeSpentSeconds,
      comment,
      screenshotsPeriod,
      worklogType,
      screenshots,
      activity,
      keepedIdles,
    }: UploadWorklogOptions = options;
    const started = moment().utc().format().replace('Z', '.000+0000');
    // if timeSpentSeconds is less than a minute JIRA wont upload it so cancel
    if (timeSpentSeconds < 60) {
      yield call(
        infoLog,
        'uploadWorklog cancelled because timeSpentSeconds < 60',
      );
      yield cancel();
    }
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
    mixpanel.track('Worklog uploaded (Automatic)', { timeSpentSeconds });
    mixpanel.people.increment('Logged time(seconds)', timeSpentSeconds);
    yield call(notify, '', 'Worklog is uploaded');
    yield call(
      infoLog,
      'worklog uploaded',
      worklog,
    );
    yield put(issuesActions.addWorklogToIssue(worklog, issueId));
  } catch (err) {
    const { issueId, timeSpentSeconds, comment } = options;
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
      const { comment, startTime, endTime } = payload;
      const started = moment(startTime).utc().format().replace('Z', '.000+0000');
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
      mixpanel.track('Worklog uploaded (Manual)', { timeSpentSeconds });
      mixpanel.people.increment('Logged time(seconds)', timeSpentSeconds);
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
