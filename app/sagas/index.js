import { fork } from 'redux-saga/effects';

import { loginFlow, loginOAuthFlow, checkJWT } from './profile';
import { getProjects, onSelectProject, whatchBoardSelection, onSelectSprint } from './projects';
import {
  watchGetIssues, watchGetIssue, watchRecentIssues,
  watchSearchIssues, watchChangeSidebar,
  watchGetIssueTypes, watchGetIssueStatuses,
  watchIssuesCriteriaFilter, watchFilterIssues,
  watchIssuesCriteriaFilterDelete, onSetFilters,
} from './issues';
import {
  watchSelectWorklogs, watchUploadScreenshot,
  watchRejectScreenshot, uploadOfflineScreenshots, uploadOfflineWorklogs,
} from './worklogs';
import { manageTimer, cutIddlesFromLastScreenshot, normalizePeriods } from './timer';


export default function* root() {
  yield [
    fork(loginFlow),
    fork(loginOAuthFlow),
    fork(checkJWT),

    fork(getProjects),
    fork(onSelectProject),
    fork(onSelectSprint),

    fork(watchGetIssues),
    fork(whatchBoardSelection),

    fork(onSetFilters),
    fork(watchIssuesCriteriaFilter),
    fork(watchIssuesCriteriaFilterDelete),
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
    fork(normalizePeriods),
  ];
}
