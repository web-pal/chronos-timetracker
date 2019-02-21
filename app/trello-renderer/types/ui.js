// @flow
import {
  actionTypes,
} from 'trello-actions';

export type UiAction =
  {|
    type: typeof actionTypes.SET_UI_STATE,
    payload: {|
      key: string,
      value: any,
    |},
  |};

export type UiState = {|
  initializeInProcess: boolean,
  isAuthorized: boolean,
|};

export type UiStateKey = $Subtype<$Keys<UiState>>;
