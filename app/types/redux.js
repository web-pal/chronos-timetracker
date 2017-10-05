// @flow
import type { ProfileState } from './profile';
import type { UiState } from './ui';
import type { SettingsState } from './settings';
import type { ProjectsState } from './projects';
import type { IssuesState } from './issues';
import type { TimerState } from './timer';

export type RegisteredField<T> = {
  name: $Keys<T>,
  type: string,
}

export type FormState<T> = {
  values: T,
  initial: T,
  registeredFields: Array<RegisteredField<T>>,
}

export type State = {
  profile: ProfileState,
  ui: UiState,
  settings: SettingsState,
  projects: ProjectsState,
  issues: IssuesState,
  timer: TimerState,
  form: any,
};
