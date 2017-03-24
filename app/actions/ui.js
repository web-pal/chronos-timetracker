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
