// @flow
import type {
  SetInitializeState, SetInitializeStateAction,
  SetAuthFormStep, SetAuthFormStepAction,
  SetSidebarType, SetSidebarTypeAction,
  SetIssueViewTab, SetIssueViewTabAction,
  SetUpdateCheckRunning, SetUpdateCheckRunningAction,
  SetUpdateAvailable, SetUpdateAvailableAction,
  SetUpdateFetching, SetUpdateFetchingAction,
  CheckForUpdatesRequest, CheckForUpdatesRequestAction,
  InstallUpdateRequest, InstallUpdateRequestAction,
  SetSidebarFiltersOpen, SetSidebarFiltersOpenAction,
  SetSettingsModalOpen, SetSettingsModalOpenAction,
  SetSupportModalOpen, SetSupportModalOpenAction,
  SetAboutModalOpen, SetAboutModalOpenAction,
  SetAlertModalOpen, SetAlertModalOpenAction,
  SetConfirmDeleteWorklogModalOpen, SetConfirmDeleteWorklogModalOpenAction,
  SetWorklogModalOpen, SetWorklogModalOpenAction,
  SetEditWorklogModalOpen, SetEditWorklogModalOpenAction,
  RemoveFlag, RemoveFlagAction,
  SetScreenshotsAlowed, SetScreenshotsAlowedAction,
  ConfirmDeleteWorklog, ConfirmDeleteWorklogAction,
  AddFlag, AddFlagAction, FlagType,
  AuthFormStep, SidebarType, TabLabel, UpdateInfo,
} from '../types';

import * as types from './actionTypes';

export const setInitializeState: SetInitializeState = (
  payload: boolean,
): SetInitializeStateAction => ({
  type: types.SET_INITIALIZE_PROCESS,
  payload,
});

export const setAuthFormStep: SetAuthFormStep = (
  payload: AuthFormStep,
): SetAuthFormStepAction => ({
  type: types.SET_AUTH_FORM_STEP,
  payload,
});

export const setSidebarType: SetSidebarType = (
  payload: SidebarType,
): SetSidebarTypeAction => ({
  type: types.SET_SIDEBAR_TYPE,
  payload,
});

export const setIssueViewTab: SetIssueViewTab = (
  payload: TabLabel,
): SetIssueViewTabAction => ({
  type: types.SET_ISSUE_VIEW_TAB,
  payload,
});

export const setUpdateCheckRunning: SetUpdateCheckRunning = (
  payload: boolean,
): SetUpdateCheckRunningAction => ({
  type: types.SET_UPDATE_CHECK_RUNNING,
  payload,
});

export const setUpdateAvailable: SetUpdateAvailable = (
  payload: UpdateInfo,
): SetUpdateAvailableAction => ({
  type: types.SET_UPDATE_AVAILABLE,
  payload,
});

export const setUpdateFetching: SetUpdateFetching = (
  payload: boolean,
): SetUpdateFetchingAction => ({
  type: types.SET_UPDATE_FETCHING,
  payload,
});

export const checkForUpdatesRequest: CheckForUpdatesRequest =
  (): CheckForUpdatesRequestAction => ({ type: types.CHECK_FOR_UPDATES_REQUEST });

export const installUpdateRequest: InstallUpdateRequest =
  (): InstallUpdateRequestAction => ({
    type: types.INSTALL_UPDATE_REQUEST,
  });

export const setSidebarFiltersOpen: SetSidebarFiltersOpen = (
  payload: boolean,
): SetSidebarFiltersOpenAction => ({
  type: types.SET_SIDEBAR_FILTERS_OPEN,
  payload,
});

export const setSettingsModalOpen: SetSettingsModalOpen = (
  payload: boolean,
): SetSettingsModalOpenAction => ({
  type: types.SET_SETTINGS_MODAL_OPEN,
  payload,
});

export const setSupportModalOpen: SetSupportModalOpen = (
  payload: boolean,
): SetSupportModalOpenAction => ({
  type: types.SET_SUPPORT_MODAL_OPEN,
  payload,
});

export const setAboutModalOpen: SetAboutModalOpen = (
  payload: boolean,
): SetAboutModalOpenAction => ({
  type: types.SET_ABOUT_MODAL_OPEN,
  payload,
});

export const setAlertModalOpen: SetAlertModalOpen = (
  payload: boolean,
): SetAlertModalOpenAction => ({
  type: types.SET_ALERT_MODAL_OPEN,
  payload,
});

export const setConfirmDeleteWorklogModalOpen: SetConfirmDeleteWorklogModalOpen = (
  payload: boolean,
): SetConfirmDeleteWorklogModalOpenAction => ({
  type: types.SET_CONFIRM_DELETE_WORKLOG_MODAL_OPEN,
  payload,
});

export const setWorklogModalOpen: SetWorklogModalOpen = (
  payload: boolean,
): SetWorklogModalOpenAction => ({
  type: types.SET_WORKLOG_MODAL_OPEN,
  payload,
});

export const setEditWorklogModalOpen: SetEditWorklogModalOpen = (
  payload: boolean,
): SetEditWorklogModalOpenAction => ({
  type: types.SET_EDIT_WORKLOG_MODAL_OPEN,
  payload,
});

export const addFlag: AddFlag = (
  payload: FlagType,
): AddFlagAction => ({
  type: types.ADD_FLAG,
  payload,
});

export const removeFlag: RemoveFlag = (
): RemoveFlagAction => ({
  type: types.REMOVE_FLAG,
});

export const setScreenshotsAllowed: SetScreenshotsAlowed = (
  payload: boolean,
): SetScreenshotsAlowedAction => ({
  type: types.SET_SCREENSHOTS_ALLOWED,
  payload,
});

export const confirmDeleteWorklog: ConfirmDeleteWorklog = (): ConfirmDeleteWorklogAction => ({
  type: types.CONFIRM_DELETE_WORKLOG,
});
