// @flow
import { types } from 'actions';
import type { ReduxFormAction } from './reduxFormActions';

import type {
  ProfileAction,
} from './profile';

import type {
  WorklogAction,
} from './worklogs';

import type {
  UiAction,
} from './ui';

import type {
  SettingsAction,
} from './settings';

import type {
  IssuesAction,
} from './issues';

export type Id = string;

export type FilterOption = {
  id: Id | null,
  iconUrl?: string,
  name: string,
  isChecked?: boolean,
};


export type CriteriaFilterName = 'Type' | 'Status' | 'Assignee';

export type CriteriaFilter = {
  name: CriteriaFilterName,
  key: string,
  options: Array<FilterOption>,
  showIcons: boolean,
};

export type CriteriaFilters = Array<CriteriaFilter>;

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

export type ClearAllReducersAction = { type: typeof types.___CLEAR_ALL_REDUCERS___ };

export type ClearAllReducers = {
  (): ClearAllReducersAction
};

export type AnyAction =
    ProfileAction
  | UiAction
  | SettingsAction
  | ReduxFormAction
  | ClearAllReducersAction
  | IssuesAction
  | WorklogAction
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
  TabLabel,
  UpdateInfo,
  FlagsArray,
  FlagType,
  UiState,
  SetAuthFormStepAction,
  SetAuthFormStep,
  SetSidebarTypeAction,
  SetSidebarType,
  SetIssueViewTabAction,
  SetIssueViewTab,
  SetUpdateCheckRunningAction,
  SetUpdateCheckRunning,
  SetUpdateAvailableAction,
  SetUpdateAvailable,
  InstallUpdateRequestAction,
  InstallUpdateRequest,
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
  SetWorklogModalOpenAction,
  SetWorklogModalOpen,
  SetUpdateFetchingAction,
  SetUpdateFetching,
  RemoveFlagAction,
  RemoveFlag,
  AddFlagAction,
  AddFlag,
  UiAction,
} from './ui';

export type {
  ApplicationRole,
  Group,
  User,
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
  SetLoginFetchingAction,
  SetLoginFetching,
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
  SetProjectsFetchingAction,
  SetProjectsFetching,
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
  IssueType,
  IssueStatus,
  IssuesMap,
  IssueTypesMap,
  IssueStatusesMap,
  IssueFilters,
  IssuesMeta,
  IssuesState,
  FetchIssuesRequestAction,
  FetchIssuesRequest,
  FillIssuesAction,
  FillIssues,
  FillRecentIssueIdsAction,
  FillRecentIssueIds,
  FillFoundIssueIdsAction,
  FillFoundIssueIds,
  FillIssueTypesAction,
  FillIssueTypes,
  FillIssueStatusesAction,
  FillIssueStatuses,
  AddFoundIssueIdsAction,
  AddFoundIssueIds,
  AddIssuesAction,
  AddIssues,
  ClearIssuesAction,
  ClearIssues,
  SetIssuesFetchingAction,
  SetIssuesFetching,
  SetRecentIssuesFetchingAction,
  SetRecentIssuesFetching,
  SetIssuesTotalCountAction,
  SetIssuesTotalCount,
  SelectIssueAction,
  SelectIssue,
  SetTrackingIssueAction,
  SetTrackingIssue,
  SetIssuesSearchValueAction,
  SetIssuesSearchValue,
  SetIssuesFilterAction,
  SetIssuesFilter,
  IssuesAction,
} from './issues';

export type {
  Idle,
  TimerState,
  TickAction,
  Tick,
  StartTimerAction,
  StartTimer,
  StopTimerAction,
  StopTimer,
  StopTimerRequestAction,
  StopTimerRequest,
  SetIdleStateAction,
  SetIdleState,
  SetLastScreenshotTimeAction,
  SetLastScreenshotTime,
  ResetTimerAction,
  ResetTimer,
  AddScreenshotAction,
  AddScreenshot,
  SetScreenshotPeriodsAction,
  SetScreenshotPeriods,
  AddIdleTimeAction,
  AddIdleTime,
  TimerAction,
} from './timer';

export type {
  ManualWorklogData,
  Worklog,
  WorklogsMap,
  WorklogsMeta,
  WorklogsState,
  FillWorklogsAction,
  FillWorklogs,
  AddWorklogsAction,
  AddWorklogs,
  ClearWorklogsAction,
  ClearWorklogs,
  FillRecentWorklogIdsAction,
  FillRecentWorklogIds,
  AddRecentWorklogIdsAction,
  AddRecentWorklogIds,
  SetWorklogsFetchingAction,
  SetWorklogsFetching,
  SetAddWorklogFetchingAction,
  SetAddWorklogFetching,
  SetWorklogCommentAction,
  SetWorklogComment,
  SelectWorklogAction,
  SelectWorklog,
  SetTemporaryWorklogIdAction,
  SetTemporaryWorklogId,
  AddManualWorklogRequestAction,
  AddManualWorklogRequest,
  WorklogAction,
} from './worklogs';
