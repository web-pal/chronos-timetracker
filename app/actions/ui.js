import storage from 'electron-json-storage';
import * as types from '../constants/';

export function setUpdateDownloadState(payload) {
  return {
    type: types.SET_UPDATE_DOWNLOAD_STATE,
    payload,
  };
}

export function setUpdateFetchState(payload) {
  return {
    type: types.SET_UPDATE_FETCH_STATE,
    payload,
  };
}

export function notifyUpdateAvailable(payload) {
  return {
    type: types.NOTIFY_UPDATE_AVAILABLE,
    payload,
  };
}

export function setSidebarType(payload) {
  return {
    type: types.SET_SIDEBAR_TYPE,
    payload,
  };
}

export function setShowSidebarFilters(payload) {
  return {
    type: types.SET_SHOW_SIDEBAR_FILTERS,
    payload,
  };
}

export function setShowSettingsModal(payload) {
  return {
    type: types.SET_SHOW_SETTINGS_MODAL,
    payload,
  };
}

export function getLocalDesktopSettings() {
  return {
    type: types.LOCAL_DESKTOP_SETTINGS_REQUEST,
  };
}

export function setLocalDesktopSettings(settingName, value) {
  storage.get('localDesktopSettings', (err, settings) => {
    const updateSettings = { ...settings, [settingName]: value };
    storage.set('localDesktopSettings', updateSettings);
  });
  return {
    type: types.SET_LOCAL_DESKTOP_SETTINGS,
    meta: settingName,
    payload: value,
  };
}

export function setShowTrackingView(payload) {
  return {
    type: types.SET_SHOW_TRACKING_VIEW,
    payload,
  };
}

export function setIssueViewTab(payload) {
  return {
    type: types.SET_ISSUE_VIEW_TAB,
    payload,
  };
}

export function setShowSupportModal(payload) {
  return {
    type: types.SET_SHOW_SUPPORT_MODAL,
    payload,
  };
}

export function setShowAboutModal(payload) {
  return {
    type: types.SET_SHOW_ABOUT_MODAL,
    payload,
  };
}


export function setShowAlertModal(payload) {
  return {
    type: types.SET_SHOW_ALERT_MODAL,
    payload,
  };
}

