// @flow
import { select, call } from 'redux-saga/effects';
import storage from 'electron-json-storage';
import { getHost } from 'selectors';

type StorageKeys =
  'lastProjectSelected'
  | 'lastProjectSelectedType'
  | 'localDesktopSettings'
  | 'desktop_tracker_jwt';

const prefixedKeys: Array<StorageKeys> = ['lastProjectSelected', 'lastProjectSelectedType'];

export const storageGetPromise = (key: string): Promise<mixed> => new Promise((resolve) => {
  storage.get(key, (err, data) => {
    if (err) {
      throw new Error(`Error getting from storage: ${err}`);
    }
    if (Object.keys(data).length === 0) {
      resolve(null);
    } else {
      resolve(data);
    }
  });
});

export const storageSetPromise = (key: string, data: *): Promise<void> => new Promise((resolve) => {
  storage.set(key, data, (err) => {
    if (err) {
      throw new Error(`Error setting to storage: ${err}`);
    }
    resolve();
  });
});

export const storageRemovePromise = (key: string): Promise<void> => new Promise((resolve) => {
  storage.remove(key, (err) => {
    if (err) {
      throw new Error(`Error removing from storage: ${err}`);
    }
    resolve();
  });
});

export function* getFromStorage(key: string): Generator<*, mixed, *> {
  const host: string = yield select(getHost);
  // $FlowFixMe: array methods buggy with Enums
  const data = yield call(
    storageGetPromise,
    prefixedKeys.includes(key) ? `${host}_${key}` : key,
  );
  return data;
}

export function* setToStorage(key: string, data: *): Generator<*, Promise<void>, *> {
  const host: string = yield select(getHost);
  // $FlowFixMe: array methods buggy with Enums
  return storageSetPromise(
    prefixedKeys.includes(key) ? `${host}_${key}` : key,
    data,
  );
}

export function* removeFromStorage(key: string): Generator<*, Promise<void>, *> {
  const host: string = yield select(getHost);
  // $FlowFixMe: array methods buggy with Enums
  return storageRemovePromise(
    prefixedKeys.includes(key) ? `${host}_${key}` : key,
  );
}
