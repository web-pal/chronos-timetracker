import * as types from './actionTypes';

export const saveFilterRequest = ({
  name,
  jql,
  filterId,
}) => ({
  type: types.SAVE_FILTER_REQUEST,
  name,
  jql,
  filterId,
});
