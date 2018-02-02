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
  |};
