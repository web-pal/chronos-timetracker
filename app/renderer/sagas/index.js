// @flow
import * as eff from 'redux-saga/effects';
import * as authSagas from './auth';
import * as settingsSagas from './settings';
import * as projectSagas from './projects';
import * as issueSagas from './issues';
import * as commentsSagas from './comments';
import * as filtersSagas from './filters';
import * as sprintsSagas from './sprints';
import * as timerSagas from './timer';
import * as worklogsSagas from './worklogs';
import * as uiSagas from './ui';
import * as screenshotSagas from './screenshots';
import * as usersSagas from './users';

import {
  initializeApp,
  takeInitialConfigureApp,
  createDispatchActionListener,
  handleAttachmentWindow,
  handleTeamStatusWindow,
  handleQuitRequest,
} from './initialize';


export default function* rootSaga(): Generator<*, void, *> {
  yield eff.all([
    // INITIALIZATION
    eff.fork(handleQuitRequest),
    eff.fork(takeInitialConfigureApp),
    eff.fork(initializeApp),
    eff.fork(handleAttachmentWindow),
    eff.fork(handleTeamStatusWindow),
    eff.fork(createDispatchActionListener),

    // auth
    eff.fork(authSagas.authFlow),
    eff.fork(authSagas.authSelfHostedFlow),
    eff.fork(authSagas.logoutFlow),
    eff.fork(authSagas.switchAccountFlow),

    // projects
    eff.fork(projectSagas.watchFetchProjectStatusesRequest),

    // issues
    eff.fork(issueSagas.watchFetchIssuesRequest),
    eff.fork(issueSagas.watchFetchRecentIssuesRequest),
    eff.fork(issueSagas.watchReFetchIssuesRequest),
    eff.fork(issueSagas.watchTransitionIssueRequest),
    eff.fork(issueSagas.watchAssignIssueRequest),
    eff.fork(issueSagas.takeFetchNewIssue),
    eff.fork(issueSagas.takeFetchUpdateIssue),

    // issuesComments
    eff.fork(commentsSagas.watchIssueCommentRequest),

    // sprints
    eff.fork(sprintsSagas.watchFetchSprintsRequest),

    // timer
    eff.fork(timerSagas.takeStartTimer),

    // settings
    eff.fork(settingsSagas.watchClearElectronChanheRequest),

    // users
    eff.fork(usersSagas.watchFetchUsers),
    eff.fork(usersSagas.watchUpdateUserTimezone),

    // worklogs
    eff.fork(worklogsSagas.watchSaveWorklogRequest),
    eff.fork(worklogsSagas.watchDeleteWorklogRequest),

    // filters
    eff.fork(filtersSagas.takeSaveFilterRequest),

    // ui
    eff.fork(uiSagas.watchScrollToIndexRequest),
    eff.fork(uiSagas.takeUiStateChange),

    // screenshots
    eff.fork(screenshotSagas.takeScreenshotRequest),
    eff.fork(screenshotSagas.takeDeleteScreenshotRequest),
    eff.fork(screenshotSagas.handleScreenshotsViewerWindow),
  ]);
}
