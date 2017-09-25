import { fork } from 'redux-saga/effects';

import {
  loginFlow,
  loginOAuthFlow,
  checkJWT,
  localDesktopSettings,
} from './profile';
import {
  getProjects,
  onSelectProject,
  whatchBoardSelection,
  onSelectSprint,
} from './projects';
import {
  watchGetIssues, watchGetIssue, watchRecentIssues,
  watchSearchIssues, watchChangeSidebar,
  watchGetIssueTypes, watchGetIssueStatuses,
  watchIssuesCriteriaFilter, watchFilterIssues,
  watchIssuesCriteriaFilterDelete, onSetFilters,
  watchSelectIssue,
  jumpToTrackingIssue,
} from './issues';
import {
  watchSelectWorklogs, watchUploadScreenshot,
  watchRejectScreenshot, uploadOfflineScreenshots,
  uploadOfflineWorklogs, updateWorklogTypeRequest,
} from './worklogs';
import {
  manageTimer,
  cutIddlesFromLastScreenshot,
  normalizePeriods,
  deleteScreenshot,
  watchStopTimer,
  watchStopTimerRequest,
} from './timer';


export default function* root() {
  yield [
    fork(loginFlow),
    fork(loginOAuthFlow),
    fork(checkJWT),
    fork(localDesktopSettings),

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
    fork(jumpToTrackingIssue),

    fork(watchChangeSidebar),

    fork(watchSelectWorklogs),
    fork(watchSelectIssue),
    fork(watchUploadScreenshot),
    fork(watchRejectScreenshot),
    fork(uploadOfflineScreenshots),
    fork(uploadOfflineWorklogs),
    fork(updateWorklogTypeRequest),

    fork(manageTimer),
    fork(cutIddlesFromLastScreenshot),
    fork(normalizePeriods),
    fork(deleteScreenshot),
    fork(watchStopTimer),
    fork(watchStopTimerRequest),
  ];
}
