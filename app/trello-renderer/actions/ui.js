// @flow
import type {
  UiAction,
} from '../types';

import {
  actionTypes,
} from '.';


export const setUiState = (
  keyOrRootValues: any,
  maybeValues: any,
): UiAction => ({
  type: actionTypes.SET_UI_STATE,
  payload: {
    keyOrRootValues,
    maybeValues,
  },
});


export const initialConfigureApp = ({
  key,
  token,
}) => ({
  type: actionTypes.INITIAL_CONFIGURE_APP,
  key,
  token,
});
