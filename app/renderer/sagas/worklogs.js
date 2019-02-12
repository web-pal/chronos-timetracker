// @flow
import {
  call,
  all,
  select,
  put,
  cancel,
  takeEvery,
  fork,
} from 'redux-saga/effects';
import moment from 'moment';
import createActionCreators from 'redux-resource-action-creators';

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
  jiraApi,
} from 'api';

import {
  throwError,
  notify,
  infoLog,
  scrollToIndexRequest,
} from './ui';


export function* getAdditionalWorklogsForIssues(
  incompleteIssues: Array<any>,
): Generator<*, *, *> {
  try {
    const worklogsArr = yield all(
      incompleteIssues.map(
        i => (
          call(
            jiraApi.getIssueWorklogs,
            {
              params: {
                issueIdOrKey: i.id,
              },
            },
          )
        ),
      ),
    );
    const worklogs = (
      worklogsArr.reduce(
        (acc, w) => ([
          ...acc,
          ...w.worklogs,
        ]),
        [],
      )
    );
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
  const worklogsActions = createActionCreators(
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
  const issueActions = createActionCreators(
    'update',
    issuesActionsConfig,
  );
  try {
    yield put(worklogsActions.pending());
    if (!worklogId) {
      yield put(issueActions.pending());
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

    const worklog = yield call(
      worklogId
        ? jiraApi.updateIssueWorklog
        : jiraApi.addIssueWorklog,
      {
        params: {
          issueIdOrKey: issueId,
          adjustEstimate,
          worklogId,
          ...(
            adjustEstimate === 'new'
              ? {
                newEstimate,
              } : {}
          ),
          ...(
            adjustEstimate === 'manual'
              ? {
                reduceBy,
              } : {}
          ),
        },
        body: {
          started,
          timeSpentSeconds,
          comment,
        },
      },
    );
    yield put(worklogsActions.succeeded({
      resources: [worklog],
    }));

    const issuesMap = yield select(getResourceMap('issues'));
    const issue = issuesMap[issueId];
    const savedIssue = yield call(
      jiraApi.getIssueByIdOrKey,
      {
        params: {
          issueIdOrKey: issue.key,
        },
      },
    );
    yield put(issueActions.succeeded({
      resources: [{
        ...savedIssue,
        fields: {
          ...savedIssue.fields,
          worklogs: [
            ...new Set([
              worklog.id,
              ...issue.fields.worklogs,
            ]),
          ],
        },
      }],
    }));

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
    const { timeSpentInSeconds } = options;
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

export function* deleteWorklog({ worklogId }: {
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

    const params = {
      issueIdOrKey: worklog.issueId,
      worklogId,
      adjustEstimate: 'auto',
    };
    yield call(
      jiraApi.deleteIssueWorklog,
      {
        params,
      },
    );
    yield put(issuesA.succeeded({
      resources: [{
        ...issue,
        fields: {
          ...issue.fields,
          worklogs: issue.fields.worklogs.filter(wid => wid !== worklogId),
        },
      }],
    }));
    yield put(worklogsA.succeeded({
      resources: [worklog.id],
    }));
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
