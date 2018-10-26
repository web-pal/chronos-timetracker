// @flow
import {
  select,
  call,
} from 'redux-saga/effects';
import storage from 'electron-json-storage';

import {
  getUiState,
  getUserData,
} from 'selectors';


const prefixedKeys = [
  'issuesSourceId',
  'issuesSourceType',
  'issuesSprintId',
  'issuesFiltersBySourceId',
];

export const storageGetPromise = (key: string): Promise<mixed> =>
  new Promise((resolve, reject) => {
    storage.get(key, (err, data) => {
      if (err) {
        reject(new Error(`Error getting from storage: ${err}`));
      }
      if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
        resolve(null);
      } else {
        resolve(data);
      }
    });
  });

export const storageSetPromise = (key: string, data: *): Promise<void> =>
  new Promise((resolve, reject) => {
    storage.set(key, data, (err) => {
      if (err) {
        reject(new Error(`Error setting to storage: ${err}`));
      }
      resolve();
    });
  });

export const storageRemovePromise = (key: string): Promise<void> =>
  new Promise((resolve, reject) => {
    storage.remove(key, (err) => {
      if (err) {
        reject(new Error(`Error removing from storage: ${err}`));
      }
      resolve();
    });
  });

export function* getFromStorage(key: string): Generator<*, mixed, *> {
  const host: URL | null = yield select(getUiState('host'));
  const userData = yield select(getUserData);
  // $FlowFixMe: array methods buggy with Enums
  if (prefixedKeys.includes(key) && !host && !userData) {
    throw new Error('Need to fill host before getting prefixed keys from storage');
  }
  const data = yield call(
    storageGetPromise,
    // $FlowFixMe: array methods buggy with Enums
    prefixedKeys.includes(key) ? `${host}_${userData.accountId}_${key}` : key,
  );
  return data;
}

export function* setToStorage(key: string, data: *): Generator<*, Promise<void>, *> {
  const host: URL | null = yield select(getUiState('host'));
  const userData = yield select(getUserData);
  // $FlowFixMe: array methods buggy with Enums
  if (prefixedKeys.includes(key) && !host && !userData) {
    throw new Error('Can\'t set prefixed variable to storage if no host provided');
  }
  return storageSetPromise(
    // $FlowFixMe: array methods buggy with Enums
    prefixedKeys.includes(key) ? `${host}_${userData.accountId}_${key}` : key,
    data,
  );
}

export function* removeFromStorage(key: string): Generator<*, Promise<void>, *> {
  const host: URL | null = yield select(getUiState('host'));
  const userData = yield select(getUserData);
  // $FlowFixMe: array methods buggy with Enums
  if (prefixedKeys.includes(key) && !host && !userData) {
    throw new Error('Can\'t remove prefixed variable from storage if no host provided');
  }
  return storageRemovePromise(
    // $FlowFixMe: array methods buggy with Enums
    prefixedKeys.includes(key) ? `${host}_${userData.accountId}_${key}` : key,
  );
}
