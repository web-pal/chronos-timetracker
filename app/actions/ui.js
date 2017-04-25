import * as types from '../constants/';
import storage from 'electron-json-storage';


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
