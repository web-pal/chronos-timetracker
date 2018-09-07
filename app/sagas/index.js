// @flow
import {
  all,
  fork,
} from 'redux-saga/effects';

import * as authSagas from './auth';
import * as settingsSagas from './settings';
import * as projectSagas from './projects';
import * as issueSagas from './issues';
import * as commentsSagas from './comments';
import * as filtersSagas from './filters';
import * as sprintsSagas from './sprints';
import * as timerSagas from './timer';
import * as worklogsSagas from './worklogs';
import * as updaterSagas from './updater';
import * as uiSagas from './ui';
import * as traySagas from './tray';

import {
  initializeApp,
  createDispatchActionListener,
} from './initializeApp';


export default function* rootSaga(): Generator<*, void, *> {
  yield all([
    // INITIALIZATION
    fork(initializeApp),
    fork(createDispatchActionListener),

    // auth
    fork(authSagas.authFlow),
    fork(authSagas.logoutFlow),
    fork(authSagas.switchAccountFlow),

    // projects
    fork(projectSagas.watchFetchProjectStatusesRequest),

    // issues
    fork(issueSagas.watchFetchIssuesRequest),
    fork(issueSagas.watchFetchRecentIssuesRequest),
    fork(issueSagas.watchReFetchIssuesRequest),
    fork(issueSagas.watchTransitionIssueRequest),
    fork(issueSagas.watchAssignIssueRequest),
    fork(issueSagas.createIpcNewIssueListener),
    fork(issueSagas.createIpcReFetchIssueListener),

    // issuesComments
    fork(commentsSagas.watchIssueCommentRequest),

    // sprints
    fork(sprintsSagas.watchFetchSprintsRequest),

    // timer
    fork(timerSagas.watchStartTimer),
    fork(timerSagas.createIpcListeners),

    // settings
    fork(settingsSagas.watchLocalDesktopSettingsChange),
    fork(settingsSagas.watchClearElectronChanheRequest),

    // worklogs
    fork(worklogsSagas.watchSaveWorklogRequest),
    fork(worklogsSagas.watchDeleteWorklogRequest),

    // updater
    fork(updaterSagas.watchInstallUpdateRequest),
    fork(updaterSagas.checkForUpdatesFlow),
    fork(updaterSagas.initializeUpdater),

    // tray
    fork(traySagas.createIpcTrayListeners),

    // filters
    fork(filtersSagas.createFilterFlow),
    fork(filtersSagas.updateFilterFlow),

    // ui
    fork(uiSagas.watchUiStateChange),
    fork(uiSagas.watchScrollToIndexRequest),
    fork(uiSagas.watchSetIssuesFilter),
    fork(uiSagas.newFeaturesFlow),
  ]);
}
