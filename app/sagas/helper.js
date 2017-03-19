import storage from 'electron-json-storage';


export function getFromStorage(name) {
  return new Promise((resove) => {
    storage.get(name, (err, data) => {
      resove(data);
    });
  });
}
