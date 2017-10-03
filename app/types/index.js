// @flow
import { types } from 'actions';
import type { ReduxFormAction } from './reduxFormActions';

import type {
  ProfileAction,
} from './profile';

import type {
  UiAction,
} from './ui';

import type {
  SettingsAction,
} from './settings';

export type Id = string;

export type SelectOption = {
  value: string | number,
  label: string,
  meta: any,
};

export type Action = {
  type: string,
  meta?: any,
  payload?: any,
  error?: any
};

export type ClearAllReducersAction = { type: types.___CLEAR_ALL_REDUCERS___ };

export type ClearAllReducers = {
  (): ClearAllReducersAction
};

export type AnyAction =
    ProfileAction
  | UiAction
  | SettingsAction
  | ReduxFormAction
  | ClearAllReducersAction
  | Action;

export interface ErrorObj {
  name?: string,
  message?: string,
}

export type {
  Settings,
  LocalDesktopSettings,
  SettingsState,
  FillSettingsAction,
  FillSettings,
  FillLocalDesktopSettingsAction,
  FillLocalDesktopSettings,
  SetLocalDesktopSettingAction,
  SetLocalDesktopSetting,
  SetSettingsModalTabAction,
  SetSettingsModalTab,
  RequestLocalDesktopSettings,
  RequestLocalDesktopSettingsAction,
  SettingsAction,
} from './settings';

export type {
  AuthFormStep,
  SidebarType,
  UiState,
  SetAuthFormStepAction,
  SetAuthFormStep,
  SetSidebarTypeAction,
  SetSidebarType,
  SetSidebarFiltersOpenAction,
  SetSidebarFiltersOpen,
  SetSettingsModalOpenAction,
  SetSettingsModalOpen,
  SetSupportModalOpenAction,
  SetSupportModalOpen,
  SetAboutModalOpenAction,
  SetAboutModalOpen,
  SetAlertModalOpenAction,
  SetAlertModalOpen,
  UiAction,
} from './ui';

export type {
  ApplicationRole,
  Group,
  UserData,
  ChronosBackendUserData,
  LoginError,
  ProfileState,
  AuthFormData,
  LoginRequestAction,
  LoginRequest,
  LoginOAuthRequestAction,
  LoginOAuthRequest,
  DenyOAuthAction,
  DenyOAuth,
  AcceptOAuthAction,
  AcceptOAuth,
  CheckJWTRequestAction,
  CheckJWTRequest,
  LogoutRequestAction,
  LogoutRequest,
  SetAuthorizedAction,
  SetAuthorized,
  ThrowLoginErrorAction,
  ThrowLoginError,
  FillUserDataAction,
  FillUserData,
  SetHostAction,
  SetHost,
  ProfileAction,
} from './profile';

export type {
  RegisteredField,
  FormState,
  State,
} from './redux';

export type {
  Project,
  Board,
  Sprint,
  ProjectsMap,
  BoardsMap,
  SprintsMap,
  ProjectsMeta,
  ProjectsState,
  FetchProjectsRequestAction,
  FetchProjectsRequest,
  SelectProjectAction,
  SelectProject,
  SelectSprintAction,
  SelectSprint,
  ProjectsAction,
  FillProjectsAction,
  FillProjects,
  FillBoardsAction,
  FillBoards,
  FillSprintsAction,
  FillSprints,
} from './projects';

export type {
  Screenshot,
  Issue,
  IssuesMap,
  IssuesMeta,
  IssuesState,
  FetchIssuesRequestAction,
  FetchIssuesRequest,
  FillIssuesAction,
  FillIssues,
  ClearIssuesAction,
  ClearIssues,
  SetIssuesFetchingAction,
  SetIssuesFetching,
  SetIssuesTotalCountAction,
  SetIssuesTotalCount,
  IssuesAction,
} from './issues';
