import { fork } from 'redux-saga/effects';

import { loginFlow, checkJWT } from './profile';
import { getProjects } from './projects';
import {
  watchGetIssues, watchRecentIssues,
  watchSearchIssues, watchChangeSidebar,
} from './issues';
import {
  watchSelectWorklogs, watchUploadScreenshot,
  watchRejectScreenshot,
} from './worklogs';
import { manageTimer } from './timer';


export default function* root() {
  yield [
    fork(loginFlow),
    fork(checkJWT),
    fork(getProjects),

    fork(watchGetIssues),
    fork(watchSearchIssues),
    fork(watchRecentIssues),

    fork(watchChangeSidebar),

    fork(watchSelectWorklogs),
    fork(watchUploadScreenshot),
    fork(watchRejectScreenshot),

    fork(manageTimer),
  ];
}
