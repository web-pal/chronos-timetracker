// @flow
import { types } from 'actions';
import type { Action, UiState } from '../types';

const initialState: UiState = {
  authFormStep: 1,
  sidebarType: 'all',
  sidebarFiltersOpen: false,
  settingsModalOpen: false,
  supportModalOpen: false,
  aboutModalOpen: false,
  alertModalOpen: false,
};

export default function ui(state: UiState = initialState, action: Action) {
  switch (action.type) {
    case types.SET_AUTH_FORM_STEP:
      return {
        ...state,
        authFormStep: action.payload,
      };
    case types.SET_SIDEBAR_TYPE:
      return {
        ...state,
        sidebarType: action.payload,
      };
    case types.SET_SIDEBAR_FILTERS_OPEN:
      return {
        ...state,
        sidebarFiltersOpen: action.payload,
      };
    case types.SET_SETTINGS_MODAL_OPEN:
      return {
        ...state,
        settingsModalOpen: action.payload,
      };
    case types.SET_SUPPORT_MODAL_OPEN:
      return {
        ...state,
        supportModalOpen: action.payload,
      };
    case types.SET_ABOUT_MODAL_OPEN:
      return {
        ...state,
        aboutModalOpen: action.payload,
      };
    case types.SET_ALERT_MODAL_OPEN:
      return {
        ...state,
        alertModalOpen: action.payload,
      };
    case types.___CLEAR_ALL_REDUCERS___:
      return initialState;
    default:
      return state;
  }
}
