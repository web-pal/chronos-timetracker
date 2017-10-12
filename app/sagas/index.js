// @flow
import { all, fork } from 'redux-saga/effects';

import * as settingsSagas from './settings';
import * as profileSagas from './profile';
import * as projectSagas from './projects';
import * as issueSagas from './issues';
import * as timerSagas from './timer';

export default function* rootSaga(): Generator<*, *, *> {
  yield all([
    // profile
    fork(profileSagas.loginFlow),
    fork(profileSagas.loginOAuthFlow),
    fork(profileSagas.logoutFlow),
    fork(profileSagas.checkJWT),

    // projects
    fork(projectSagas.watchFetchProjectsRequest),
    fork(projectSagas.watchFetchSprintsRequest),
    fork(projectSagas.watchProjectSelection),

    // issues
    fork(issueSagas.watchFetchIssuesRequest),
    fork(issueSagas.watchSidebarTabChange),
    fork(issueSagas.watchFiltersChange),

    // timer
    fork(timerSagas.watchStartTimer),
    fork(timerSagas.createIpcListeners),

    // settings
    fork(settingsSagas.localDesktopSettingsFlow),
  ]);
}
