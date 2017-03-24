import * as types from '../constants';

export function showLoading() {
  return {
    type: types.SHOW_LOADINGBAR,
  };
}

export function hideLoading() {
  return {
    type: types.HIDE_LOADINGBAR,
  };
}

export function resetLoading() {
  return {
    type: types.RESET_LOADINGBAR,
  };
}
