// @flow
import {
  actionTypes,
} from '../actions';

import type {
  UiAction,
  UiState,
} from '../types';


const mergeValues = (
  values,
  state,
) => (
  Object.keys(values).reduce((s, v) => ({
    ...s,
    [v]: values[v]?._merge ? ({ /* eslint-disable-line */
      ...state[v],
      ...values[v],
    }) : (
      values[v]
    ),
  }), {})
);

const initialState: UiState = {
  initializeInProcess: false,
  isAuthorized: false,
};

const ui = (
  state: UiState = initialState,
  action: UiAction,
) => {
  switch (action.type) {
    case actionTypes.SET_UI_STATE: {
      const {
        keyOrRootValues,
        maybeValues,
      } = action.payload;
      const [
        values,
        key,
      ] = (
        maybeValues === undefined
          ? [
            keyOrRootValues,
            null,
          ]
          : [
            maybeValues,
            keyOrRootValues,
          ]
      );
      return {
        ...state,
        ...(
          key
            ? ({
              [key]: {
                ...state[key],
                ...mergeValues(
                  values,
                  state[key],
                ),
              },
            })
            : (
              mergeValues(
                values,
                state,
              )
            )
        ),
      };
    }
    default:
      return state;
  }
};

export default ui;
