import * as types from '../constants/';

export function addRecentWorklog(worklog) {
  return {
    type: types.ADD_RECENT_WORKLOG,
    payload: worklog,
  };
}
