// @flow

import type {
  Store as ReduxStore,
  Dispatch as ReduxDispatch,
} from 'redux';

import type {
  UiAction,
  UiState,
} from './ui';

import type {
  SettingsAction,
  SettingsState,
} from './settings';

import type {
  TimerAction,
  TimerState,
} from './timer';

import type {
  AuthAction,
} from './auth';

import type {
  ProfileAction,
  ProfileState,
} from './profile';

import type {
  ResourcesAction,
} from './resources';

import type {
  ProjectsAction,
} from './projects';

import type {
  IssuesAction,
} from './issues';

import type {
  IssuesFieldsState,
} from './issuesFields';

import type {
  IssuesTypesState,
} from './issuesTypes';

import type {
  IssuesCommentsState,
} from './issuesComments';

import type {
  IssuesStatusesState,
} from './issuesStatuses';

import type {
  WorklogsAction,
} from './worklogs';

import type {
  SprintsAction,
} from './sprints';

export type {
  RemainingEstimate,
  UiAction,
  UiState,
} from './ui';

export type {
  SettingsAction,
  SettingsState,
  SettingsGeneral,
} from './settings';

export type {
  TimerAction,
  TimerState,
} from './timer';

export type {
  AuthAction,
} from './auth';

export type {
  ProfileAction,
  ProfileState,
  User,
} from './profile';

export type {
  ResourcesAction,
} from './resources';

export type {
  ProjectsAction,
  ProjectsResources,
  Project,
} from './projects';

export type {
  BoardsResources,
  Board,
} from './boards';

export type {
  IssuesAction,
  IssuesResources,
  Issue,
} from './issues';

export type {
  IssuesFieldsState,
  IssuesFieldsResources,
  IssueField,
  Component,
  Version,
  IssuePriority,
  IssueResolution,
  IssueWorklog,
} from './issuesFields';

export type {
  IssuesTypesState,
  IssuesTypesResources,
  IssueType,
} from './issuesTypes';

export type {
  IssuesCommentsState,
  IssuesCommentsResources,
  IssueComment,
} from './issuesComments';

export type {
  IssuesStatusesState,
  IssuesStatusesResources,
  IssueStatus,
} from './issuesStatuses';

export type {
  IssuesReports,
} from './issuesReports';

export type {
  WorklogsAction,
  WorklogsResources,
  Worklog,
} from './worklogs';

export type {
  SprintsAction,
  SprintsResources,
  Sprint,
} from './sprints';

export type {
  SelectedOption,
} from './options';

export type {
  Filter,
  JIRAFilter,
  FiltersResources,
} from './filters';

export type {
  Epic,
} from './epics';

export type Id = string | number;

export type IndexedIds = {
  [Id]: number,
}


export type Action =
  UiAction |
  SettingsAction |
  TimerAction |
  AuthAction |
  ProfileAction |
  ResourcesAction |
  ProjectsAction |
  IssuesAction |
  WorklogsAction |
  SprintsAction;

export type State =
  UiState &
  SettingsState &
  TimerState &
  ProfileState &
  IssuesFieldsState &
  IssuesTypesState &
  IssuesCommentsState &
  IssuesStatusesState;

export type Store = ReduxStore<State, Action>;
export type Dispatch = ReduxDispatch<Action>;
