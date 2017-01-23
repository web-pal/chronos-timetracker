import * as types from '../constants/';

export function changeFilter(value) {
  return {
    type: types.CHANGE_FILTER,
    payload: value,
  };
}

export function clearFilter() {
  return {
    type: types.CLEAR_FILTER,
  };
}

export function changeResolveFilter(value) {
  return {
    type: types.CHANGE_RESOLVE_FILTER,
    payload: value,
  };
}
