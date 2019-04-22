// @flow
import * as eff from 'redux-saga/effects';
import moment from 'moment';
import rimraf from 'rimraf';
import createActionCreators from 'redux-resource-action-creators';
import {
  remote,
} from 'electron';

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
  screenshotsActions,
  issuesActions,
  actionTypes,
} from 'actions';
import {
  getResourceIds,
  getResourceMap,
  getUiState,
} from 'selectors';
import {
  jiraApi,
  chronosApi,
} from 'api';
import config from 'config';

import {
  throwError,
  notify,
  infoLog,
  scrollToIndexRequest,
} from './ui';
import {
  uploadScreenshots,
} from './screenshots';

import {
  version,
} from '../../package.json';

const { app } = remote.require('electron');

export function* getAdditionalWorklogsForIssues(
  incompleteIssues: Array<any>,
): Generator<*, *, *> {
  try {
    const worklogsArr = yield eff.all(
      incompleteIssues.map(
        i => (
          eff.call(
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
    if (!isAuto) {
      yield eff.fork(notify, {
        resourceType: 'worklogs',
        request: 'saveWorklog',
        spinnerTitle: worklogId ? 'Edit worklog' : 'Add worklog',
        title: worklogId ? 'Successfully edited worklog' : 'Successfully added worklog',
      });
    }
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
    if (isAuto) {
      let screenshots = yield eff.select(getUiState('screenshots'));
      yield eff.all(
        screenshots
          .filter(s => s.status === 'offline')
          .map(s => (
            eff.call(
              uploadScreenshots,
              {
                filenameImage: s.filename,
                filenameThumb: s.filenameThumb,
                imagePath: s.imagePath,
                imageThumbPath: s.imageThumbPath,
              },
            )
          )),
      );
      screenshots = (
        screenshots
          .map(
            ({
              imagePath,
              imageThumbPath,
              status,
              ...rest
            }) => ({
              ...rest,
              status: (
                status === 'offline'
                  ? 'success'
                  : status
              ),
            }),
          )
      );
      const activity = yield eff.select(getUiState('activity'));
      const screenshotsWithActivity = (
        screenshots.map(
          ({
            imgUrl,
            thumbUrl,
            ...s
          }, index) => ({
            ...s,
            activity: (
              activity[index] || 0
            ),
            activityPercentage: (
              (activity[index] || 0)
                ? (
                  100 - ((
                    (activity[index] || 0)
                    / (
                      (screenshots.length - 1) === index
                        ? (
                          timeSpentSeconds - (config.screenshotsPeriod * index)
                        )
                        : config.screenshotsPeriod
                    )
                  ) * 100)
                )
                : 100
            ),
          }),
        )
      );
      yield eff.call(
        chronosApi.saveScreenshots,
        {
          body: {
            worklogId: worklog.id,
            issueId,
            screenshots: screenshotsWithActivity,
            screenshotsPeriod: config.screenshotsPeriod,
          },
        },
      );
      yield eff.cps(
        rimraf,
        `${app.getPath('userData')}/screens/`,
      );
    }
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
              ...(issue?.fields?.worklogs || []),
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
    const screenshotViewerWindowId = yield eff.select(
      getUiState('screenshotViewerWindowId'),
    );
    if (
      isAuto
      && screenshotViewerWindowId
    ) {
      const win = remote.BrowserWindow.fromId(screenshotViewerWindowId);
      if (
        win
        && !win.isDestroyed()
      ) {
        yield eff.put(screenshotsActions.showScreenshotsViewerWindow({
          issueId,
          worklogId: worklog.id,
        }));
      }
    }
    yield eff.fork(scrollToIndexRequest, {
      issueId,
      worklogId: worklog.id,
    });
    incrementMixpanel('Logged time(seconds)', timeSpentSeconds);
    trackMixpanel(
      `Worklog uploaded (${isAuto ? 'Automatic' : 'Manual'})`,
      {
        timeSpentInSeconds,
        version,
      },
    );
    yield eff.put(uiActions.setUiState({
      saveWorklogInProcess: false,
    }));
    const quit = yield eff.select(getUiState('quitAfterSaveWorklog'));
    if (quit) {
      if (process.env.NODE_ENV === 'development') {
        window.location.reload();
      } else {
        app.quit();
      }
    }
    return worklog;
  } catch (err) {
    yield eff.put(uiActions.setUiState({
      saveWorklogInProcess: false,
    }));
    if (err.isInternetConnectionIssue) {
      yield eff.put(uiActions.setModalState('worklogInetIssue', true));
      const { tryAgain } = yield eff.race({
        tryAgain: eff.take(actionTypes.TRY_SAVE_WORKLOG_AGAIN_REQUEST),
        skip: eff.take(actionTypes.STOP_TRY_SAVE_WORKLOG_REQUEST),
      });
      if (tryAgain) {
        return yield eff.call(
          saveWorklog,
          {
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
              isAuto,
            },
          },
        );
      }
      yield eff.cps(
        rimraf,
        `${app.getPath('userData')}/screens/`,
      );
      return null;
    }
    yield eff.call(throwError, err);
    return null;
  }
}

export function* uploadWorklog(options: any): Generator<*, *, *> {
  try {
    yield eff.call(
      infoLog,
      'started uploading worklog with options:',
      options,
    );
    yield eff.put(uiActions.setUiState({
      saveWorklogInProcess: true,
    }));
    yield eff.fork(notify, {
      resourceType: 'worklogs',
      request: 'saveWorklog',
      spinnerTitle: 'Add worklog',
      title: 'Successfully added worklog',
    });
    const {
      takeScreenshotLoading,
      uploadScreenshotLoading,
    } = yield eff.select(getUiState([
      'takeScreenshotLoading',
      'uploadScreenshotLoading',
    ]));
    if (
      takeScreenshotLoading
      || uploadScreenshotLoading
    ) {
      console.log('Wait when upload screenshots will be finished');
      yield eff.race([
        eff.take(actionTypes.TAKE_SCREENSHOT_FINISHED),
        eff.take(actionTypes.UPLOAD_SCREENSHOT_FINISHED),
      ]);
    }
    /* If screenshot uploading or making - wait */
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
    yield eff.put(uiActions.setUiState({
      saveWorklogInProcess: false,
    }));
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
