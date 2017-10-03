// @flow
import storage from 'electron-json-storage';

export function getFromStorage(key: string): Promise<*> {
  return new Promise((resolve) => {
    storage.get(key, (err, data) => {
      if (err) {
        throw new Error(`Error getting from storage: ${err}`);
      }
      resolve(data);
    });
  });
}

export function setToStorage(key: string, data: *): Promise<void> {
  return new Promise((resolve) => {
    storage.set(key, data, (err) => {
      if (err) {
        throw new Error(`Error setting to storage: ${err}`);
      }
      resolve();
    });
  });
}

export function removeFromStorage(key: string): Promise<void> {
  return new Promise((resolve) => {
    storage.remove(key, (err) => {
      if (err) {
        throw new Error(`Error removing from storage: ${err}`);
      }
      resolve();
    });
  });
}
