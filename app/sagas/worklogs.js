// @flow
import { call, take, select, put, cancel, takeEvery, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import Raven from 'raven-js';
import * as Api from 'api';
import filter from 'lodash.filter';
import pull from 'lodash.pull';
import { types, worklogsActions, uiActions, issuesActions } from 'actions';
import { getUserData, getSelectedIssue, getRecentIssueIds, getIssuesMap } from 'selectors';
import moment from 'moment';
import { jts } from 'time-util';
import mixpanel from 'mixpanel-browser';

import { getFromStorage, setToStorage } from './storage';
import { throwError, notify, infoLog } from './ui';
import type { Id, Worklog, DeleteWorklogRequestAction, EditWorklogRequestAction, Issue } from '../types';

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
    // need to reselect issue to update issue saved in selectedIssue
    const selectedIssue = yield select(getSelectedIssue);
    if (selectedIssue.id === issueId) {
      const newIssue = {
        ...selectedIssue,
        fields: {
          ...selectedIssue.fields,
          worklog: {
            ...selectedIssue.fields.worklog,
            worklogs: {
              worklog,
              ...selectedIssue.fields.worklog.worklogs,
            },
          },
        },
      };
      yield put(issuesActions.selectIssue(newIssue));
    }
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
    return issues.reduce((map, issue) => {
      const _map = { ...map };
      _map[issue.id] = issue;
      return _map;
    }, {});
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
    return incompleteIssues;
  }
}

export function* addManualWorklogFlow(): Generator<*, *, *> {
  try {
    while (true) {
      const { payload } = yield take(types.ADD_MANUAL_WORKLOG_REQUEST);
      const selectedIssue = yield select(getSelectedIssue);
      yield put(worklogsActions.setEditWorklogFetching(true));
      const issueId = selectedIssue.id;
      const { comment, startTime, totalSpent } = payload;
      const started = moment(startTime).utc().format().replace('Z', '.000+0000');
      const timeSpentSeconds = jts(totalSpent);
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
      const newWorklog = yield call(Api.addWorklog, jiraUploadOptions);
      yield put(worklogsActions.setEditWorklogFetching(false));
      yield put(uiActions.setWorklogModalOpen(false));
      mixpanel.track('Worklog uploaded (Manual)', { timeSpentSeconds });
      mixpanel.people.increment('Logged time(seconds)', timeSpentSeconds);
      yield call(delay, 1000);
      yield call(notify, '', 'Manual worklog succesfully added');
      const newIssue = {
        ...selectedIssue,
        fields: {
          ...selectedIssue.fields,
          worklog: {
            ...selectedIssue.fields.worklog,
            worklogs: [
              newWorklog,
              ...selectedIssue.fields.worklog.worklogs,
            ],
          },
        },
      };
      // need to update issue if it is still present in reducer
      const issues = yield select(getIssuesMap);
      if (issues[issueId]) {
        yield put(issuesActions.addWorklogToIssue(newWorklog, issueId));
      } else {
        yield put(issuesActions.addIssues({ map: { [issueId]: newIssue }, ids: [issueId] }));
      }
      // neew to add issue in recent issues list if it's not there
      const recentIssueIds = yield select(getRecentIssueIds);
      if (!recentIssueIds.includes(selectedIssue.id)) {
        const newRecentIssueIds = [...recentIssueIds];
        newRecentIssueIds.push(selectedIssue.id);
        yield put(issuesActions.fillRecentIssueIds(newRecentIssueIds));
      }
      // need to reselect issue to update issue saved in selectedIssue
      yield put(issuesActions.selectIssue(newIssue));
    }
  } catch (err) {
    yield put(worklogsActions.setEditWorklogFetching(false));
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* deleteWorklogFlow({ payload }: DeleteWorklogRequestAction): Generator<*, void, *> {
  try {
    const selectedIssue = yield select(getSelectedIssue);
    const worklog = payload;
    yield call(
      infoLog,
      'requested to delete worklog',
      worklog,
    );
    yield put(uiActions.setConfirmDeleteWorklogModalOpen(true));
    const { close } = yield race({
      confirm: take(types.CONFIRM_DELETE_WORKLOG),
      close: take(types.SET_CONFIRM_DELETE_WORKLOG_MODAL_OPEN),
    });
    if (close) {
      yield call(infoLog, 'worklog deletion cancelled');
      yield cancel();
    }
    yield call(infoLog, 'worklog deletion confirmed');
    const opts = {
      issueId: worklog.issueId,
      worklogId: worklog.id,
      adjustEstimate: 'auto',
    };
    yield call(Api.deleteWorklog, opts);
    yield call(infoLog, 'worklog deleted', worklog);
    // need to reselect issue to update issue saved in selectedIssue
    const newIssue = {
      ...selectedIssue,
      fields: {
        ...selectedIssue.fields,
        worklog: {
          ...selectedIssue.fields.worklog,
          worklogs: filter(
            selectedIssue.fields.worklog.worklogs,
            (value) => value.id !== worklog.id,
          ),
        },
      },
    };
    const issueId = worklog.issueId;
    const issues = yield select(getIssuesMap);
    if (issues[issueId]) {
      yield put(issuesActions.deleteWorklogFromIssue(worklog, issueId));
    } else {
      yield put(issuesActions.addIssues({ map: { [issueId]: newIssue }, ids: [issueId] }));
    }
    yield put(issuesActions.selectIssue(newIssue));
    // need to delete issue from recent issues list if you deleted your last worklog
    const { key } = yield select(getUserData);
    const selfWorklogs = filter(
      newIssue.fields.worklog.worklogs,
      (value) => value.author.key === key,
    );
    if (selfWorklogs.length === 0) {
      const recentIssueIds = yield select(getRecentIssueIds);
      if (recentIssueIds.includes(selectedIssue.id)) {
        const newRecentIssueIds = [...recentIssueIds];
        pull(newRecentIssueIds, selectedIssue.id);
        yield put(issuesActions.fillRecentIssueIds(newRecentIssueIds));
      }
    }
    yield call(notify, '', 'Successfully deleted worklog');
  } catch (err) {
    yield call(notify, '', 'Failed to delete worklog');
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchDeleteWorklogRequest(): Generator<*, void, *> {
  yield takeEvery(types.DELETE_WORKLOG_REQUEST, deleteWorklogFlow);
}

export function* editWorklogFlow({ payload }: EditWorklogRequestAction): Generator<*, *, *> {
  try {
    const worklog = payload;
    const selectedIssue = yield select(getSelectedIssue);
    yield put(worklogsActions.setEditingWorklog(worklog));
    yield put(uiActions.setEditWorklogModalOpen(true));
    yield call(
      infoLog,
      'requested to edit worklog',
      worklog,
    );
    const { confirm, close } = yield race({
      confirm: take(types.CONFIRM_EDIT_WORKLOG),
      close: take(types.SET_EDIT_WORKLOG_MODAL_OPEN),
    });
    if (close) {
      yield call(
        infoLog,
        'worklog editing cancelled',
        worklog,
      );
      yield put(worklogsActions.setEditingWorklog(null));
      yield cancel();
    }
    yield put(worklogsActions.setEditWorklogFetching(true));
    const newWorklog: Worklog = confirm.payload;
    const { started, timeSpentSeconds, issueId, comment, id } = newWorklog;
    const jiraUploadOptions: {
      issueId: Id,
      worklogId: Id,
      adjustEstimate: 'auto',
      worklog: {
        started: any,
        timeSpentSeconds: number,
        comment?: string | null,
      },
    } = {
      issueId,
      worklogId: id,
      adjustEstimate: 'auto',
      worklog: {
        started,
        timeSpentSeconds,
        comment,
      },
    };
    yield call(Api.updateWorklog, jiraUploadOptions);
    yield call(infoLog, 'success updating worklog', newWorklog);
    const newIssue = { ...selectedIssue };
    const newWorklogs = selectedIssue.fields.worklog.worklogs.map(w => {
      if (w.id === newWorklog.id) {
        return newWorklog;
      }
      return w;
    });
    newIssue.fields.worklog.worklogs = newWorklogs;
    yield put(issuesActions.addIssues({
      ids: [newIssue.id],
      map: { [newIssue.id]: newIssue },
    }));
    yield put(issuesActions.selectIssue(newIssue));
    yield put(worklogsActions.setEditingWorklog(null));
    yield put(worklogsActions.setEditWorklogFetching(false));
    yield put(uiActions.setEditWorklogModalOpen(false));
    yield call(notify, '', 'Successfully edited worklog');
  } catch (err) {
    yield put(worklogsActions.setEditingWorklog(null));
    yield put(worklogsActions.setEditWorklogFetching(false));
    yield put(uiActions.setEditWorklogModalOpen(false));
    yield call(notify, '', 'Failed to edit worklog');
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchEditWorklogRequest(): Generator<*, void, *> {
  yield takeEvery(types.EDIT_WORKLOG_REQUEST, editWorklogFlow);
}
