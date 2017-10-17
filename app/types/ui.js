// @flow
import type { Node } from 'react';
import { types } from 'actions';

export type AuthFormStep = 1 | 2;

export type FlagType = {
  title: string,
  appearance: string,
  description: string,
  icon: Node,
};
export type FlagsArray = Array<FlagType>;

export type SidebarType = 'all' | 'recent';

export type TabLabel = 'Details' | 'Comments' | 'Worklogs';

// TODO update info type
export type UpdateInfo = any;

export type UiState = {|
  +authFormStep: AuthFormStep,
  +sidebarType: SidebarType,
  +issueViewTab: TabLabel,
  +updateCheckRunning: boolean,
  +updateAvailable: UpdateInfo | null,
  +updateFetching: boolean,
  +sidebarFiltersOpen: boolean,
  +settingsModalOpen: boolean,
  +supportModalOpen: boolean,
  +aboutModalOpen: boolean,
  +alertModalOpen: boolean,
  +worklogModalOpen: boolean,
  +flags: FlagsArray,
|};

//
export type SetAuthFormStepAction =
  {| type: typeof types.SET_AUTH_FORM_STEP, +payload: AuthFormStep |};

export type SetAuthFormStep = {
  (payload: AuthFormStep): SetAuthFormStepAction
};

//
export type SetSidebarTypeAction =
  {| type: typeof types.SET_SIDEBAR_TYPE, +payload: SidebarType |};

export type SetSidebarType = {
  (payload: SidebarType): SetSidebarTypeAction
};

//
export type SetIssueViewTabAction =
  {| type: typeof types.SET_ISSUE_VIEW_TAB, payload: TabLabel |};

export type SetIssueViewTab = {
  (payload: TabLabel): SetIssueViewTabAction
};

//
export type SetUpdateCheckRunningAction =
  {| type: typeof types.SET_UPDATE_CHECK_RUNNING, payload: boolean |};

export type SetUpdateCheckRunning = {
  (payload: boolean): SetUpdateCheckRunningAction
};

//
export type SetUpdateAvailableAction =
  {| type: typeof types.SET_UPDATE_AVAILABLE, payload: UpdateInfo |};

export type SetUpdateAvailable = {
  (payload: UpdateInfo): SetUpdateAvailableAction
};

//
export type SetUpdateFetchingAction =
  {| type: typeof types.SET_UPDATE_FETCHING, payload: boolean |};

export type SetUpdateFetching = {
  (payload: boolean): SetUpdateFetchingAction
};

//
export type InstallUpdateRequestAction =
  {| type: typeof types.INSTALL_UPDATE_REQUEST |};

export type InstallUpdateRequest = {
  (): InstallUpdateRequestAction
};

//
export type SetSidebarFiltersOpenAction =
  {| type: typeof types.SET_SIDEBAR_FILTERS_OPEN, +payload: boolean |};

export type SetSidebarFiltersOpen = {
  (payload: boolean): SetSidebarFiltersOpenAction
};

//
export type SetSettingsModalOpenAction =
  {| type: typeof types.SET_SETTINGS_MODAL_OPEN, +payload: boolean |};

export type SetSettingsModalOpen = {
  (payload: boolean): SetSettingsModalOpenAction
};

//
export type SetSupportModalOpenAction =
  {| type: typeof types.SET_SUPPORT_MODAL_OPEN, +payload: boolean |};

export type SetSupportModalOpen = {
  (payload: boolean): SetSupportModalOpenAction
};

//
export type SetAboutModalOpenAction =
  {| type: typeof types.SET_ABOUT_MODAL_OPEN, +payload: boolean |};

export type SetAboutModalOpen = {
  (payload: boolean): SetAboutModalOpenAction
};

//
export type SetAlertModalOpenAction =
  {| type: typeof types.SET_ALERT_MODAL_OPEN, +payload: boolean |};

export type SetAlertModalOpen = {
  (payload: boolean): SetAlertModalOpenAction
};

//
export type SetWorklogModalOpenAction =
  {| type: typeof types.SET_WORKLOG_MODAL_OPEN, +payload: boolean |};

export type SetWorklogModalOpen = {
  (payload: boolean): SetWorklogModalOpenAction
};

//
export type RemoveFlagAction =
  {| type: typeof types.REMOVE_FLAG |};

export type RemoveFlag = {
  (): RemoveFlagAction
};

//
export type AddFlagAction =
  {| type: typeof types.ADD_FLAG, +payload: FlagType |};

export type AddFlag = {
  (): AddFlagAction
};

export type UiAction =
  SetAuthFormStepAction
  | SetSidebarTypeAction
  | SetIssueViewTabAction
  | SetUpdateFetchingAction
  | SetSidebarFiltersOpenAction
  | SetSettingsModalOpenAction
  | SetSupportModalOpenAction
  | SetAboutModalOpenAction
  | SetAlertModalOpenAction
  | SetWorklogModalOpenAction
  | RemoveFlagAction
  | AddFlagAction;
