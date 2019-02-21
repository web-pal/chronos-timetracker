// @flow
import * as eff from 'redux-saga/effects';

import * as actions from 'trello-actions';

import {
  throwError,
} from './helpers';


export function* initialize(): Generator<*, void, *> {
  try {
    yield eff.put(actions.setUiState({
      initializeInProcess: true,
    }));
  } catch (err) {
    yield eff.call(throwError, err);
  } finally {
    yield eff.put(actions.setUiState({
      initializeInProcess: false,
    }));
  }
}
