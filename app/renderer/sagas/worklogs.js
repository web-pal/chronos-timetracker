// @flow
import {
  call,
  select,
  put,
  cancel,
  takeEvery,
  fork,
} from 'redux-saga/effects';
import moment from 'moment';
import createActionCreators from 'redux-resource-action-creators';
import * as Api from 'api';

import {
  trackMixpanel,
  incrementMixpanel,
} from 'utils/stat';

import type {
  Id,
} from 'types';

import {
  jts,
} from 'utils/time-util';

import {
  types,
  uiActions,
  issuesActions,
} from 'actions';
import {
  getResourceIds,
  getResourceMap,
  getUiState,
} from 'selectors';
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

export function* saveWorklogAsOffline(worklog: any): Generator<*, *, *> {
  let offlineWorklogs = yield call(getFromStorage, 'offlineWorklogs');
  if (!Array.isArray(offlineWorklogs)) {
    offlineWorklogs = [];
  }
  offlineWorklogs.push(worklog);
  yield call(setToStorage, 'offlineWorklogs', offlineWorklogs);
}


export function* getAdditionalWorklogsForIssues(
  incompleteIssues: Array<any>,
): Generator<*, *, *> {
  try {
    yield call(infoLog, 'getting additional worklogs for issues', incompleteIssues);
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
    return {
      additionalIssuesArr: issues,
      additionalIssuesMap: issues.reduce((map, issue) => ({ ...map, [issue.id]: issue }), {}),
    };
  } catch (err) {
    yield call(throwError, err);
    return incompleteIssues;
  }
}

export function* saveWorklog({
  payload: {
    issueId,
    worklogId,
    comment,
    startTime,
    adjustEstimate,
    newEstimate,
    reduceBy,
    timeSpent,
    timeSpentInSeconds,
    isAuto = true,
  },
}: {
  payload: any,
}): Generator<*, *, *> {
  const worklogsA = createActionCreators(
    worklogId ? 'update' : 'create',
    {
      resourceType: 'worklogs',
      request: 'saveWorklog',
    },
  );
  const issuesActionsConfig = {
    resourceType: 'issues',
    request: 'updateIssue',
  };
  const recentIssues = yield select(getResourceIds('issues', 'recentIssues'));
  if (recentIssues.length) {
    issuesActionsConfig.list = 'recentIssues';
  }
  const issuesA = createActionCreators(
    'update',
    issuesActionsConfig,
  );
  try {
    yield put(worklogsA.pending());
    if (!worklogId) {
      yield put(issuesA.pending());
    }
    yield put(uiActions.setModalState(
      'worklog',
      false,
    ));
    yield fork(notify, {
      resourceType: 'worklogs',
      request: 'saveWorklog',
      spinnerTitle: worklogId ? 'Edit worklog' : 'Add worklog',
      title: worklogId ? 'Successfully edited worklog' : 'Successfully added worklog',
    });
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
      adjustEstimate,
      worklog: {
        started,
        timeSpentSeconds,
        comment,
      },
    };

    if (adjustEstimate === 'new') jiraUploadOptions.newEstimate = newEstimate;
    if (adjustEstimate === 'manual') jiraUploadOptions.reduceBy = reduceBy;

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
      const updatedIssue = yield call(Api.fetchIssueByKey, issue.key);
      yield put(issuesA.succeeded({
        resources: [{
          ...updatedIssue,
          fields: {
            ...updatedIssue.fields,
            worklogs: [worklog.id, ...issue.fields.worklogs],
          },
        }],
      }));
    }
    yield put(uiActions.setUiState(
      'selectedIssueId',
      issueId,
    ));
    yield put(uiActions.setUiState(
      'issueViewTab',
      'Worklogs',
    ));
    yield put(uiActions.setUiState(
      'selectedWorklogId',
      worklog.id,
    ));
    yield fork(scrollToIndexRequest, {
      issueId,
      worklogId: worklog.id,
    });
    incrementMixpanel('Logged time(seconds)', timeSpentSeconds);
    trackMixpanel(
      `Worklog uploaded (${isAuto ? 'Automatic' : 'Manual'})`,
      {
        timeSpentInSeconds,
      },
    );
    return worklog;
  } catch (err) {
    yield call(throwError, err);
  }
  return null;
}

export function* chronosBackendUploadWorklog(options: any): Generator<*, *, *> {
  try {
    const jwt = yield call(getFromStorage, 'desktop_tracker_jwt');
    if (!jwt) {
      throw new Error('Attempt to upload worklog on chronos backend!');
    }
    yield call(Api.chronosBackendUploadWorklog, options);
  } catch (err) {
    yield call(throwError, err);
  }
}

export function* uploadWorklog(options: any): Generator<*, *, *> {
  try {
    yield call(
      infoLog,
      'started uploading worklog with options:',
      options,
    );
    /*
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
    */
    const {
      timeSpentInSeconds,
    } = options;
    const startTime = moment()
      .subtract({ seconds: timeSpentInSeconds })
      .utc()
      .format()
      .replace('Z', '.000+0000');

    const adjustEstimate = yield select(getUiState('remainingEstimateValue'));
    const newEstimate = yield select(getUiState('remainingEstimateNewValue'));
    const reduceBy = yield select(getUiState('remainingEstimateReduceByValue'));

    const worklog = yield call(saveWorklog, {
      payload: {
        ...options,
        adjustEstimate,
        newEstimate,
        reduceBy,
        startTime,
        isAuto: true,
      },
    });

    const postAlsoAsIssueComment = yield select(getUiState('postAlsoAsIssueComment'));
    if (postAlsoAsIssueComment && options.comment) {
      yield put(issuesActions.commentRequest(options.comment, options.issueId));
    }

    // reset ui state
    yield put(uiActions.resetUiState([
      'worklogComment',
      'postAlsoAsIssueComment',
      'remainingEstimateValue',
      'remainingEstimateNewValue',
      'remainingEstimateReduceByValue',
    ]));

    /*
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
    yield fork(chronosBackendUploadWorklog, backendUploadOptions);
    */
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
    yield fork(notify, {
      title: 'Failed to upload worklog',
    });
    yield call(throwError, err);
  }
}

export function* deleteWorklog({
  worklogId,
}: {
  worklogId: Id,
}): Generator<*, void, *> {
  const worklogsA = createActionCreators('delete', {
    resourceType: 'worklogs',
    request: 'deleteWorklog',
  });
  const issuesA = createActionCreators('update', {
    resourceType: 'issues',
    request: 'deleteIssue',
  });
  try {
    yield put(worklogsA.pending());
    yield put(issuesA.pending());
    yield fork(notify, {
      resourceType: 'worklogs',
      request: 'deleteWorklog',
      spinnerTitle: 'Delete worklog',
      title: 'Successfully deleted worklog',
    });

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
    trackMixpanel('Worklog deleted');
  } catch (err) {
    yield fork(notify, {
      title: 'Failed to delete worklog',
    });
    yield call(throwError, err);
  }
}

export function* watchDeleteWorklogRequest(): Generator<*, void, *> {
  yield takeEvery(types.DELETE_WORKLOG_REQUEST, deleteWorklog);
}

export function* watchSaveWorklogRequest(): Generator<*, void, *> {
  yield takeEvery(types.SAVE_WORKLOG_REQUEST, saveWorklog);
}
