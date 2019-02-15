// @flow
import {
  actionTypes,
} from 'shared/actions';

export const checkUpdates = () => ({
  type: actionTypes.CHECK_UPDATES_REQUEST,
  scope: 'main',
});

export const downloadUpdate = () => ({
  type: actionTypes.DOWNLOAD_UPDATE_REQUEST,
  scope: 'main',
});

export const setUpdateSettings = ({
  autoDownload,
  allowPrerelease,
}) => ({
  type: actionTypes.SET_UPDATE_SETTINGS,
  autoDownload,
  allowPrerelease,
  scope: 'main',
});
