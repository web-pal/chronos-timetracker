// @flow
import { types } from 'actions';
import type { Action } from './index';

// TODO type for settings
export type Settings = any;

// TODO type for local desktop settings
export type LocalDesktopSettings = any;

export type SettingsState = {|
  +dispersion: string,
  +interval: string,
  +screenshotsPeriod: number,
  +screenshotsQuantity: number,
  +screenshotsEnabled: string,
  +modalTab: string,
  +screenshotsEnabledUsers: Array<string | null>,
  +localDesktopSettings: LocalDesktopSettings,
|};

//
export type FillSettingsAction =
  {| type: typeof types.FILL_SETTINGS, payload: Settings |} & Action;

export type FillSettings = {
  (payload: Settings): FillSettingsAction
};

//
export type FillLocalDesktopSettingsAction =
  {| type: typeof types.FILL_LOCAL_DESKTOP_SETTINGS, payload: LocalDesktopSettings |};

export type FillLocalDesktopSettings = {
  (payload: LocalDesktopSettings): FillLocalDesktopSettingsAction
};

//
export type SetLocalDesktopSettingAction =
  {| type: typeof types.SET_LOCAL_DESKTOP_SETTING, payload: any, meta: string |};

export type SetLocalDesktopSetting = {
  (payload: any, setting: string): SetLocalDesktopSettingAction
};

//
export type SetSettingsModalTabAction =
  {| type: typeof types.SET_SETTINGS_MODAL_TAB, payload: string |};

export type SetSettingsModalTab = {
  (payload: string): SetSettingsModalTabAction
};

//
export type RequestLocalDesktopSettingsAction =
  {| type: typeof types.REQUEST_LOCAL_DESKTOP_SETTINGS |};

export type RequestLocalDesktopSettings = {
  (): RequestLocalDesktopSettingsAction
}

export type SettingsAction =
  | FillSettingsAction
  | FillLocalDesktopSettingsAction
  | SetLocalDesktopSettingAction
  | SetSettingsModalTabAction
  | RequestLocalDesktopSettingsAction;

export type SettingsActionCreator =
  | FillSettings
  | FillLocalDesktopSettings
  | SetLocalDesktopSetting
  | SetSettingsModalTab
  | RequestLocalDesktopSettings;
