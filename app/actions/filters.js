import * as types from './actionTypes';

export const createFilterRequest = ({ name, jql }) => ({
  type: types.CREATE_FILTER_REQUEST,
  payload: { name, jql },
});

export const updateFilterRequest = ({ oldFilter, newJQLString }) => ({
  type: types.UPDATE_FILTER_REQUEST,
  payload: {
    oldFilter,
    newJQLString,
  },
});
