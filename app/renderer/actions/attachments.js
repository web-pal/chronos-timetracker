import * as types from './actionTypes';


export const nextAttachment = () => ({
  type: types.NEXT_ATTACHMENT,
});

export const prevAttachment = () => ({
  type: types.PREV_ATTACHMENT,
});

export const selectAttachment = index => ({
  type: types.SELECT_ATTACHMENT,
  payload: index,
});
