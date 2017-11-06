// @flow
import { types } from 'actions';
import type {
  SettingsState,
  Action,
} from '../types';

const initialState: SettingsState = {
  dispersion: '0',
  interval: '600',
  screenshotsPeriod: 600,
  screenshotsQuantity: 1,
  screenshotsEnabled: '',
  modalTab: 'General',
  screenshotsEnabledUsers: [],
  localDesktopSettings: {},
};

export default function settings(state: SettingsState = initialState, action: Action) {
  switch (action.type) {
    case types.FILL_SETTINGS:
      return {
        ...state,
        ...action.payload,
      };
    case types.FILL_LOCAL_DESKTOP_SETTINGS:
      return {
        ...state,
        localDesktopSettings: action.payload,
      };
    case types.SET_SETTINGS_MODAL_TAB:
      return {
        ...state,
        modalTab: action.payload,
      };
    case types.SET_LOCAL_DESKTOP_SETTING:
      return {
        ...state,
        localDesktopSettings: {
          ...state.localDesktopSettings,
          [action.meta]: action.payload,
        },
      };
    case types.___CLEAR_ALL_REDUCERS___:
      return initialState;
    default:
      return state;
  }
}
