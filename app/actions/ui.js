// @flow
import type {
  SetAuthFormStep, SetAuthFormStepAction,
  SetSidebarType, SetSidebarTypeAction,
  SetIssueViewTab, SetIssueViewTabAction,
  SetSidebarFiltersOpen, SetSidebarFiltersOpenAction,
  SetSettingsModalOpen, SetSettingsModalOpenAction,
  SetSupportModalOpen, SetSupportModalOpenAction,
  SetAboutModalOpen, SetAboutModalOpenAction,
  SetAlertModalOpen, SetAlertModalOpenAction,
  SetWorklogModalOpen, SetWorklogModalOpenAction,
  AuthFormStep, SidebarType, TabLabel,
} from '../types';

import * as types from './actionTypes';

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

export const setWorklogModalOpen: SetWorklogModalOpen = (
  payload: boolean,
): SetWorklogModalOpenAction => ({
  type: types.SET_WORKLOG_MODAL_OPEN,
  payload,
});
