import { fork } from 'redux-saga/effects';

import { loginFlow, checkJWT } from './profile';
import { getProjects } from './projects';
import { watchGetIssues, watchRecentIssues, watchSearchIssues } from './issues';


export default function* root() {
  yield [
    fork(loginFlow),
    fork(checkJWT),
    fork(getProjects),
    fork(watchGetIssues),
    fork(watchSearchIssues),
    fork(watchRecentIssues),
  ];
}
