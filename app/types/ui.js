// @flow
import { types } from 'actions';

export type AuthFormStep = 1 | 2;

export type SidebarType = 'all' | 'recent';

export type TabLabel = 'Details' | 'Comments' | 'Worklogs';

export type UiState = {|
  +authFormStep: AuthFormStep,
  +sidebarType: SidebarType,
  +issueViewTab: TabLabel,
  +sidebarFiltersOpen: boolean,
  +settingsModalOpen: boolean,
  +supportModalOpen: boolean,
  +aboutModalOpen: boolean,
  +alertModalOpen: boolean,
|};

//
export type SetAuthFormStepAction =
  {| type: types.SET_AUTH_FORM_STEP, +payload: AuthFormStep |};

export type SetAuthFormStep = {
  (payload: AuthFormStep): SetAuthFormStepAction
};

//
export type SetSidebarTypeAction =
  {| type: types.SET_SIDEBAR_TYPE, +payload: SidebarType |};

export type SetSidebarType = {
  (payload: SidebarType): SetSidebarTypeAction
};

//
export type SetIssueViewTabAction =
  {| type: types.SET_ISSUE_VIEW_TAB, payload: TabLabel |};

export type SetIssueViewTab = {
  (payload: TabLabel): SetIssueViewTabAction
};

//
export type SetSidebarFiltersOpenAction =
  {| type: types.SET_SIDEBAR_FILTERS_OPEN, +payload: boolean |};

export type SetSidebarFiltersOpen = {
  (payload: boolean): SetSidebarFiltersOpenAction
};

//
export type SetSettingsModalOpenAction =
  {| type: types.SET_SETTINGS_MODAL_OPEN, +payload: boolean |};

export type SetSettingsModalOpen = {
  (payload: boolean): SetSettingsModalOpenAction
};

//
export type SetSupportModalOpenAction =
  {| type: types.SET_SUPPORT_MODAL_OPEN, +payload: boolean |};

export type SetSupportModalOpen = {
  (payload: boolean): SetSupportModalOpenAction
};

//
export type SetAboutModalOpenAction =
  {| type: types.SET_ABOUT_MODAL_OPEN, +payload: boolean |};

export type SetAboutModalOpen = {
  (payload: boolean): SetAboutModalOpenAction
};

//
export type SetAlertModalOpenAction =
  {| type: types.SET_ALERT_MODAL_OPEN, +payload: boolean |};

export type SetAlertModalOpen = {
  (payload: boolean): SetAlertModalOpenAction
};

export type UiAction =
  SetAuthFormStepAction
  | SetSidebarTypeAction
  | SetIssueViewTabAction
  | SetSidebarFiltersOpenAction
  | SetSettingsModalOpenAction
  | SetSupportModalOpenAction
  | SetAboutModalOpenAction
  | SetAlertModalOpenAction;
