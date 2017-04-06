import { fork } from 'redux-saga/effects';

import { loginFlow, checkJWT } from './profile';
import { getProjects, onSelectProject } from './projects';
import {
  watchGetIssues, watchGetIssue, watchRecentIssues,
  watchSearchIssues, watchChangeSidebar,
  watchGetIssueTypes, watchGetIssueStatuses,
  watchIssuesCriteriaFilter, watchFilterIssues,
} from './issues';
import {
  watchSelectWorklogs, watchUploadScreenshot,
  watchRejectScreenshot, uploadOfflineScreenshots, uploadOfflineWorklogs,
} from './worklogs';
import { manageTimer, cutIddlesFromLastScreenshot } from './timer';


export default function* root() {
  yield [
    fork(loginFlow),
    fork(checkJWT),

    fork(getProjects),
    fork(onSelectProject),

    fork(watchGetIssues),

    fork(watchIssuesCriteriaFilter),
    fork(watchFilterIssues),
    fork(watchGetIssue),
    fork(watchSearchIssues),
    fork(watchRecentIssues),

    fork(watchGetIssueTypes),
    fork(watchGetIssueStatuses),

    fork(watchChangeSidebar),

    fork(watchSelectWorklogs),
    fork(watchUploadScreenshot),
    fork(watchRejectScreenshot),
    fork(uploadOfflineScreenshots),
    fork(uploadOfflineWorklogs),

    fork(manageTimer),
    fork(cutIddlesFromLastScreenshot),
  ];
}
