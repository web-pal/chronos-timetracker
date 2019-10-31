import * as eff from 'redux-saga/effects';
import storage from 'electron-json-storage';

import {
  getUiState,
  getResourceIds,
} from 'selectors';
import {
  persistInitialState as persistInitialUiState,
} from '../reducers/ui';


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

export const clearElectronStorage = () => (
  new Promise((resolve, reject) => {
    storage.clear((err) => {
      if (err) {
        reject(new Error('Error clear storage'));
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

export function calculateInactivityPeriod({
  idleTimeInSceonds,
  time,
  screenshotsPeriod,
}) {
  const screenshotsPeriodInSeconds = (
    screenshotsPeriod < 30
      ? 30
      : screenshotsPeriod
  );

  const startIdlePeriodNumber = (
    Math.ceil((time - idleTimeInSceonds) / screenshotsPeriodInSeconds)
  );
  const startPeriodInSeconds = startIdlePeriodNumber * screenshotsPeriodInSeconds;
  const startPeriodNumber = Math.floor(startPeriodInSeconds / screenshotsPeriodInSeconds);
  const fullyExpiredPeriods = (
    Math.floor((time - startPeriodInSeconds) / screenshotsPeriodInSeconds)
  );

  return {
    screenshotsPeriodInSeconds,
    startIdlePeriodNumber,
    startPeriodInSeconds,
    startPeriodNumber,
    fullyExpiredPeriods,
  };
}

export function* savePersistStorage() {
  const persistUiState = yield eff.select(
    getUiState(Object.keys(persistInitialUiState)),
  );
  const hostname = yield eff.select(
    getUiState('hostname'),
  );
  yield eff.call(
    setElectronStorage,
    `persistUiState_${hostname}`,
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

  const favoriteProjects = yield eff.select(
    getResourceIds('projects', 'favorites'),
  );
  yield eff.call(
    setElectronStorage,
    'projects_favorites',
    favoriteProjects,
  );
}
