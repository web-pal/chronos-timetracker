// @flow
import type {
  SettingsState,
} from 'types';


export const getSettingsState = (key: string) =>
  ({
    settings,
  }: {
    settings: SettingsState
  }) =>
    settings[key];
