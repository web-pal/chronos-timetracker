// @flow
import * as actionTypes from '../actions/actionTypes/settings';


export type SettingsAction =
  {|
    type: typeof actionTypes.FILL_LOCAL_DESKTOP_SETTINGS,
    payload: any,
  |} |
  {|
    type: typeof actionTypes.SET_LOCAL_DESKTOP_SETTING,
    value: any,
    settingName: string,
  |} |
  {|
    type: typeof actionTypes.SET_SETTINGS_MODAL_TAB,
    tabName: string,
  |} |
  {|
    type: typeof actionTypes.CLEAR_ELECTRON_CACHE,
  |};

export type SettingsState = {|
  dispersion: string,
  interval: string,
  screenshotsPeriod: number,
  screenshotsQuantity: number,
  screenshotsEnabled: boolean,
  modalTab: 'General' | 'Notifications' | 'Updates',
  screenshotsEnabledUsers: Array<any>,
  localDesktopSettings: any,
|};

export type SettingsGeneral = {
  autoCheckForUpdates: boolean,
  nativeNotifications: boolean,
  screenshotPreviewTime: number,
  showScreenshotPreview: boolean,
  trayShowTimer: boolean,
  updateChannel: string,
  updateAutomatically: boolean,
  allowEmptyComment: boolean,
};
