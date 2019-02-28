// @flow
import * as eff from 'redux-saga/effects';
import storage from 'electron-json-storage';

import {
  getUiState,
} from 'trello-selectors';
import {
  persistInitialState as persistInitialUiState,
} from '../reducers/ui';


export function* throwError(err: any): Generator<*, void, *> {
  yield eff.call(console.error, err);
}

export const setElectronStorage = (
  key,
  data,
) => (
  new Promise((resolve, reject) => {
    storage.set(key, data, (err) => {
      if (err) {
        reject(new Error(`Error setting to storage: ${err}`));
      }
      resolve();
    });
  })
);

export const removeElectronStorage = key => (
  new Promise((resolve, reject) => {
    storage.remove(key, (err) => {
      if (err) {
        reject(new Error(`Error removing from storage: ${err}`));
      }
      resolve();
    });
  })
);

export const getElectronStorage = (key, defaultValue) => (
  new Promise((resolve, reject) => {
    storage.get(key, (err, data) => {
      if (err) {
        reject(new Error(`Error getting from storage: ${err}`));
      }
      if (
        !data
        || (
          typeof data === 'object'
          && Object.keys(data).length === 0
        )
      ) {
        resolve(
          defaultValue || null,
        );
      } else {
        resolve(data);
      }
      resolve();
    });
  })
);

export function* savePersistStorage() {
  const persistUiState = yield eff.select(
    getUiState(Object.keys(persistInitialUiState)),
  );
  const trelloUserId = yield eff.select(
    getUiState('trelloUserId'),
  );
  yield eff.call(
    setElectronStorage,
    `persistUiState_trello_${trelloUserId}`,
    persistUiState,
  );

  const accounts = yield eff.select(
    getUiState('accounts'),
  );
  yield eff.call(
    setElectronStorage,
    'accounts',
    accounts,
  );
}

export function* notify(): Generator<*, void, *> {
  yield eff.call(console.log, 'notify');
}
