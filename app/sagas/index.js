// @flow
import { all, fork } from 'redux-saga/effects';

import * as profileSagas from './profile';
import * as projectSagas from './projects';
import * as issueSagas from './issues';

export default function* rootSaga(): Generator<*, *, *> {
  yield all([
    fork(profileSagas.loginFlow),
    fork(profileSagas.loginOAuthFlow),
    fork(profileSagas.checkJWT),

    //
    fork(projectSagas.watchFetchProjectsRequest),
    fork(projectSagas.watchFetchSprintsRequest),
    fork(projectSagas.watchProjectSelection),

    //
    fork(issueSagas.watchFetchIssuesRequest),
    fork(issueSagas.watchSidebarTabChange),
  ]);
}
