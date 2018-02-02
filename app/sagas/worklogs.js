// @flow
import {
  delay,
} from 'redux-saga';
import {
  call,
  take,
  select,
  put,
  cancel,
  takeEvery,
  race,
  fork,
} from 'redux-saga/effects';
import createActionCreators from 'redux-resource-action-creators';
import Raven from 'raven-js';
import * as Api from 'api';
import filter from 'lodash.filter';
import pull from 'lodash.pull';
import {
  types,
  worklogsActions,
  uiActions,
  issuesActions,
  resourcesActions,
} from 'actions';
import {
  getUserData,
  getSelectedIssue,
  getRecentIssueIds,
  getIssuesMap,
  getTrackingIssue,
  getSelectedIssueId,
  getResourceMap,
  getIssueWorklogs,
} from 'selectors';
import moment from 'moment';
import { jts } from 'time-util';

import {
  trackMixpanel,
  incrementMixpanel,
} from '../utils/stat';
import {
  fetchRecentIssues,
} from './issues';
import {
  getFromStorage,
  setToStorage,
} from './storage';
import {
  throwError,
  notify,
  infoLog,
  scrollToIndexRequest,
} from './ui';
import type { Id, Worklog, DeleteWorklogRequestAction, EditWorklogRequestAction, Issue } from '../types';

export function* saveWorklogAsOffline(worklog: any): Generator<*, *, *> {
  let offlineWorklogs = yield call(getFromStorage, 'offlineWorklogs');
  if (!Array.isArray(offlineWorklogs)) {
    offlineWorklogs = [];
  }
  offlineWorklogs.push(worklog);
  yield call(setToStorage, 'offlineWorklogs', offlineWorklogs);
}


export function* getAdditionalWorklogsForIssues(
  incompleteIssues: Array<Issue>,
): Generator<*, *, *> {
  try {
    yield call(infoLog, 'getting additional worklogs for issues', incompleteIssues);
    const worklogs = yield call(Api.fetchWorklogs, incompleteIssues);
    const issues = incompleteIssues.map((issue) => {
      const additionalWorklogs = filter(worklogs, w => w.issueId === issue.id);
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
    return {
      additionalIssuesArr: issues,
      additionalIssuesMap: issues.reduce((map, issue) => ({ ...map, [issue.id]: issue }), {}),
    };
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
    return incompleteIssues;
  }
}

export function* saveWorklog({
  payload: {
    issueId,
    worklogId,
    comment,
    startTime,
    timeSpent,
    timeSpentInSeconds,
  },
}): Generator<*, *, *> {
  const worklogsA = createActionCreators(worklogId ? 'update' : 'create', {
    resourceName: 'worklogs',
    request: 'saveWorklog',
  });
  const issuesA = createActionCreators('update', {
    resourceName: 'issues',
    request: 'updateIssue',
  });
  try {
    yield put(worklogsA.pending());
    if (!worklogId) {
      yield put(issuesA.pending());
    }

    const started = moment(startTime).utc().format().replace('Z', '.000+0000');
    const timeSpentSeconds = timeSpentInSeconds || jts(timeSpent);
    if (timeSpentSeconds < 60) {
      yield call(
        infoLog,
        'uploadWorklog cancelled because timeSpentSeconds < 60',
      );
      yield cancel();
    }
    const jiraUploadOptions = {
      worklogId,
      issueId,
      adjustEstimate: 'auto',
      worklog: {
        started,
        timeSpentSeconds,
        comment,
      },
    };
    const worklog = yield call(
      worklogId ? Api.updateWorklog : Api.addWorklog,
      jiraUploadOptions,
    );
    yield put(worklogsA.succeeded({
      resources: [worklog],
    }));

    if (!worklogId) {
      const issuesMap = yield select(getResourceMap('issues'));
      const issue = issuesMap[issueId];
      yield put(issuesA.succeeded({
        resources: [{
          ...issue,
          fields: {
            ...issue.fields,
            worklogs: [worklog.id, ...issue.fields.worklogs],
          },
        }],
      }));
    }
    yield put(uiActions.setUiState(
      'selectedWorklogId',
      worklog.id,
    ));
    yield put(resourcesActions.clearResourceList({
      resourceName: 'issues',
      list: 'recentIssues',
    }));
    yield fork(fetchRecentIssues);
    yield fork(scrollToIndexRequest, {
      issueId,
      worklogId: worklog.id,
    });
    yield put(uiActions.setModalState(
      'worklog',
      false,
    ));
    yield call(
      notify,
      '',
      worklogId ? 'Successfully edited worklog' : 'Successfully added worklog',
    );
    trackMixpanel('Worklog uploaded (Manual)', { timeSpentSeconds });
    incrementMixpanel('Logged time(seconds)', timeSpentSeconds);
    return worklog;
  } catch (err) {
    yield call(throwError, err);
  }
}

export function* uploadWorklog(options): Generator<*, *, *> {
  try {
    yield call(
      infoLog,
      'started uploading worklog with options:',
      options,
    );
    const {
      issueId,
      comment,
      timeSpentInSeconds,
      screenshotsPeriod,
      worklogType,
      screenshots,
      activity,
      keepedIdles,
    } = options;
    const startTime = moment()
      .subtract({ seconds: timeSpentInSeconds })
      .utc()
      .format()
      .replace('Z', '.000+0000');

    const worklog = yield call(saveWorklog, {
      payload: {
        ...options,
        startTime,
      },
    });

    const backendUploadOptions = {
      worklogId: worklog.id,
      issueId,
      comment,
      timeSpentSeconds: timeSpentInSeconds,
      screenshotsPeriod,
      worklogType,
      screenshots,
      activity,
      keepedIdles,
    };
    yield call(Api.chronosBackendUploadWorklog, backendUploadOptions);
    trackMixpanel('Worklog uploaded (Automatic)', { timeSpentInSeconds });
    incrementMixpanel('Logged time(seconds)', timeSpentInSeconds);
    yield call(
      infoLog,
      'worklog uploaded',
      worklog,
    );
  } catch (err) {
    /*
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
    */
    yield call(notify, '', 'Failed to upload worklog');
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* deleteWorklog({
  worklogId,
}: {
  worklogId: number | string,
}): Generator<*, void, *> {
  const worklogsA = createActionCreators('delete', {
    resourceName: 'worklogs',
    request: 'deleteWorklog',
  });
  const issuesA = createActionCreators('update', {
    resourceName: 'issues',
    request: 'deleteIssue',
  });
  try {
    yield put(worklogsA.pending());
    yield put(issuesA.pending());

    const worklogsMap = yield select(getResourceMap('worklogs'));
    const issuesMap = yield select(getResourceMap('issues'));
    const worklog = worklogsMap[worklogId];
    const issue = issuesMap[worklog.issueId];

    yield call(
      infoLog,
      'requested to delete worklog',
      worklogId,
    );
    const opts = {
      issueId: worklog.issueId,
      worklogId,
      adjustEstimate: 'auto',
    };
    yield call(Api.deleteWorklog, opts);
    yield put(worklogsA.succeeded({
      resources: [worklog.issueId],
    }));
    yield put(issuesA.succeeded({
      resources: [{
        ...issue,
        fields: {
          ...issue.fields,
          worklogs: issue.fields.worklogs.filter(wid => wid !== worklogId),
        },
      }],
    }));
    yield call(infoLog, 'worklog deleted', worklog);
    yield call(notify, '', 'Successfully deleted worklog');
  } catch (err) {
    yield call(notify, '', 'Failed to delete worklog');
    yield call(throwError, err);
  }
}

export function* watchDeleteWorklogRequest(): Generator<*, void, *> {
  yield takeEvery(types.DELETE_WORKLOG_REQUEST, deleteWorklog);
}

export function* watchSaveWorklogRequest(): Generator<*, void, *> {
  yield takeEvery(types.SAVE_WORKLOG_REQUEST, saveWorklog);
}
