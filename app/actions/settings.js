// @flow
import type {
  SettingsAction,
} from 'types';

import * as types from './actionTypes';


export const fillLocalDesktopSettings = (
  payload: any,
): SettingsAction => ({
  type: types.FILL_LOCAL_DESKTOP_SETTINGS,
  payload,
});

export const setLocalDesktopSetting = (
  value: any,
  settingName: string,
): SettingsAction => ({
  type: types.SET_LOCAL_DESKTOP_SETTING,
  value,
  settingName,
});

export const setSettingsModalTab = (
  tabName: string,
): SettingsAction => ({
  type: types.SET_SETTINGS_MODAL_TAB,
  tabName,
});
