// @flow

import type {
  FillSettings, FillSettingsAction,
  FillLocalDesktopSettings, FillLocalDesktopSettingsAction,
  SetLocalDesktopSetting, SetLocalDesktopSettingAction,
  SetSettingsModalTab, SetSettingsModalTabAction,
  RequestLocalDesktopSettings, RequestLocalDesktopSettingsAction,
  Settings,
} from '../types';

import * as types from './actionTypes';

export const fillSettings: FillSettings = (
  payload: Settings,
): FillSettingsAction => ({
  type: types.FILL_SETTINGS,
  payload,
});

export const fillLocalDesktopSettings: FillLocalDesktopSettings = (
  payload,
): FillLocalDesktopSettingsAction => ({
  type: types.FILL_LOCAL_DESKTOP_SETTINGS,
  payload,
});

export const setLocalDesktopSetting: SetLocalDesktopSetting = (
  payload: any,
  setting: string,
): SetLocalDesktopSettingAction => ({
  type: types.SET_LOCAL_DESKTOP_SETTING,
  payload,
  meta: setting,
});

export const setSettingsModalTab: SetSettingsModalTab = (
  payload: string,
): SetSettingsModalTabAction => ({
  type: types.SET_SETTINGS_MODAL_TAB,
  payload,
});

export const requestLocalDesktopSettings: RequestLocalDesktopSettings =
  (): RequestLocalDesktopSettingsAction => ({
    type: types.REQUEST_LOCAL_DESKTOP_SETTINGS,
  });
