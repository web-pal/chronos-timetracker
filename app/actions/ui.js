import * as types from '../constants/';

export const setUpdateDownloadState = (payload) => ({
  type: types.SET_UPDATE_DOWNLOAD_STATE,
  payload,
});

export const setUpdateFetchState = (payload) => ({
    type: types.SET_UPDATE_FETCH_STATE,
    payload,
});

export const notifyUpdateAvailable = (payload) => ({
    type: types.NOTIFY_UPDATE_AVAILABLE,
    payload,
});

export const openDescriptionPopup = () => ({
  type: types.OPEN_DESCRIPTION_POPUP,
});

export const closeDescriptionPopup = () => ({
  type: types.CLOSE_DESCRIPTION_POPUP,
});

export const setSidebarType = (value) => ({
  type: types.SET_SIDEBAR_TYPE,
  payload: value,
});

export const setIdleState = (value) => ({
  type: types.SET_IDLE_STATE,
  payload: value,
});
