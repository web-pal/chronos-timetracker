// @flow
import type {
  SettingsAction,
} from 'types';

import * as types from './actionTypes';

export const clearElectronCache = (): SettingsAction => ({
  type: types.CLEAR_ELECTRON_CACHE,
});
