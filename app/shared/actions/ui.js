import {
  actionTypes,
} from '.';

export const setModalState = (
  modalName,
  state,
) => ({
  type: actionTypes.SET_MODAL_STATE,
  scope: ['mainRenderer'],
  payload: {
    modalName,
    state,
  },
});
