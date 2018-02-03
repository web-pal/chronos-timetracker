// @flow
import {
  actionTypes,
} from 'actions';
import type {
  SettingsState,
  Action,
} from 'types';

const initialState: SettingsState = {
  dispersion: '0',
  interval: '600',
  screenshotsPeriod: 600,
  screenshotsQuantity: 1,
  screenshotsEnabled: false,
  modalTab: 'General',
  screenshotsEnabledUsers: [],
  localDesktopSettings: {},
};

export default function settings(
  state: SettingsState = initialState,
  action: Action,
) {
  switch (action.type) {
    case actionTypes.FILL_LOCAL_DESKTOP_SETTINGS:
      return {
        ...state,
        localDesktopSettings: action.payload,
      };
    case actionTypes.SET_SETTINGS_MODAL_TAB:
      return {
        ...state,
        modalTab: action.tabName,
      };
    case actionTypes.SET_LOCAL_DESKTOP_SETTING:
      return {
        ...state,
        localDesktopSettings: {
          ...state.localDesktopSettings,
          [action.settingName]: action.value,
        },
      };
    case actionTypes.__CLEAR_ALL_REDUCERS__:
      return initialState;
    default:
      return state;
  }
}
