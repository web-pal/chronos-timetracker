// @flow
import type {
  SettingsAction,
  SettingsGeneral,
} from 'types';

import * as types from './actionTypes';


export const fillLocalDesktopSettings = (
  payload: SettingsGeneral,
): SettingsAction => ({
  type: types.FILL_LOCAL_DESKTOP_SETTINGS,
  payload,
});

export const setLocalDesktopSetting = (
  value: boolean,
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
