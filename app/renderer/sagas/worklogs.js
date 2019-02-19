// @flow
import * as eff from 'redux-saga/effects';
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
    const worklogsArr = yield eff.all(
      incompleteIssues.map(
        i => (
          eff.all(
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
    yield eff.call(throwError, err);
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
  yield eff.put(uiActions.setUiState({
    saveWorklogInProcess: true,
  }));

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
  const recentIssues = yield eff.select(getResourceIds('issues', 'recentIssues'));
  if (recentIssues.length) {
    issuesActionsConfig.list = 'recentIssues';
  }
  const issueActions = createActionCreators(
    'update',
    issuesActionsConfig,
  );
  try {
    yield eff.put(worklogsActions.pending());
    if (!worklogId) {
      yield eff.put(issueActions.pending());
    }
    yield eff.put(uiActions.setModalState(
      'worklog',
      false,
    ));
    yield eff.fork(notify, {
      resourceType: 'worklogs',
      request: 'saveWorklog',
      spinnerTitle: worklogId ? 'Edit worklog' : 'Add worklog',
      title: worklogId ? 'Successfully edited worklog' : 'Successfully added worklog',
    });
    const started = moment(startTime).utc().format().replace('Z', '.000+0000');
    const timeSpentSeconds = timeSpentInSeconds || jts(timeSpent);
    if (timeSpentSeconds < 60) {
      yield eff.call(
        infoLog,
        'uploadWorklog cancelled because timeSpentSeconds < 60',
      );
      yield eff.put(uiActions.setUiState({
        saveWorklogInProcess: false,
      }));
      yield eff.cancel();
    }

    const worklog = yield eff.call(
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
    yield eff.put(worklogsActions.succeeded({
      resources: [worklog],
    }));

    const issuesMap = yield eff.select(getResourceMap('issues'));
    const issue = issuesMap[issueId];
    const savedIssue = yield eff.call(
      jiraApi.getIssueByIdOrKey,
      {
        params: {
          issueIdOrKey: issue.key,
        },
      },
    );
    yield eff.put(issueActions.succeeded({
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
    yield eff.put(uiActions.setUiState({
      selectedIssueId: issueId,
      issueViewTab: 'Worklogs',
      selectedWorklogId: worklog.id,
    }));
    yield eff.fork(scrollToIndexRequest, {
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
    yield eff.put(uiActions.setUiState({
      saveWorklogInProcess: false,
    }));
    return worklog;
  } catch (err) {
    yield eff.put(uiActions.setUiState({
      saveWorklogInProcess: false,
    }));
    yield eff.call(throwError, err);
  }
}

export function* uploadWorklog(options: any): Generator<*, *, *> {
  try {
    yield eff.call(
      infoLog,
      'started uploading worklog with options:',
      options,
    );
    const { timeSpentInSeconds } = options;
    const startTime = moment()
      .subtract({ seconds: timeSpentInSeconds })
      .utc()
      .format()
      .replace('Z', '.000+0000');

    const adjustEstimate = yield eff.select(getUiState('remainingEstimateValue'));
    const newEstimate = yield eff.select(getUiState('remainingEstimateNewValue'));
    const reduceBy = yield eff.select(getUiState('remainingEstimateReduceByValue'));

    const worklog = yield eff.call(saveWorklog, {
      payload: {
        ...options,
        adjustEstimate,
        newEstimate,
        reduceBy,
        startTime,
        isAuto: true,
      },
    });

    const postAlsoAsIssueComment = yield eff.select(getUiState('postAlsoAsIssueComment'));
    if (postAlsoAsIssueComment && options.comment) {
      yield eff.put(issuesActions.commentRequest(options.comment, options.issueId));
    }

    // reset ui state
    yield eff.put(uiActions.resetUiState([
      'worklogComment',
      'postAlsoAsIssueComment',
      'remainingEstimateValue',
      'remainingEstimateNewValue',
      'remainingEstimateReduceByValue',
    ]));
    yield eff.call(
      infoLog,
      'worklog uploaded',
      worklog,
    );
  } catch (err) {
    yield eff.fork(notify, {
      title: 'Failed to upload worklog',
    });
    yield eff.call(throwError, err);
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
    yield eff.put(worklogsA.pending());
    yield eff.put(issuesA.pending());
    yield eff.fork(notify, {
      resourceType: 'worklogs',
      request: 'deleteWorklog',
      spinnerTitle: 'Delete worklog',
      title: 'Successfully deleted worklog',
    });

    const worklogsMap = yield eff.select(getResourceMap('worklogs'));
    const issuesMap = yield eff.select(getResourceMap('issues'));
    const worklog = worklogsMap[worklogId];
    const issue = issuesMap[worklog.issueId];

    const params = {
      issueIdOrKey: worklog.issueId,
      worklogId,
      adjustEstimate: 'auto',
    };
    yield eff.call(
      jiraApi.deleteIssueWorklog,
      {
        params,
      },
    );
    yield eff.put(issuesA.succeeded({
      resources: [{
        ...issue,
        fields: {
          ...issue.fields,
          worklogs: issue.fields.worklogs.filter(wid => wid !== worklogId),
        },
      }],
    }));
    yield eff.put(worklogsA.succeeded({
      resources: [worklog.id],
    }));
  } catch (err) {
    yield eff.fork(notify, {
      title: 'Failed to delete worklog',
    });
    yield eff.call(throwError, err);
  }
}

export function* watchDeleteWorklogRequest(): Generator<*, void, *> {
  yield eff.takeEvery(types.DELETE_WORKLOG_REQUEST, deleteWorklog);
}

export function* watchSaveWorklogRequest(): Generator<*, void, *> {
  yield eff.takeEvery(types.SAVE_WORKLOG_REQUEST, saveWorklog);
}
