// @flow

import type {
  UiAction,
} from './ui';

import type {
  SettingsAction,
} from './settings';

import type {
  TimerAction,
} from './timer';

import type {
  AuthAction,
} from './auth';

import type {
  ProfileAction,
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
  WorklogsAction,
} from './worklogs';

import type {
  SprintsAction,
} from './sprints';


export type {
  UiAction,
  UiState,
} from './ui';

export type {
  SettingsAction,
  SettingsState,
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
} from './profile';

export type {
  ResourcesAction,
} from './resources';

export type {
  ProjectsAction,
} from './projects';

export type {
  IssuesAction,
} from './issues';

export type {
  WorklogsAction,
} from './worklogs';

export type {
  SprintsAction,
} from './sprints';

export type Id = string | number;

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
