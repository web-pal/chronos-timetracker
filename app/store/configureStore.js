import configureStoreDev from './configureStore.development';
import configureStoreProd from './configureStore.production';

let exportStore;

if (process.env.NODE_ENV === 'production') {
  exportStore = configureStoreProd;
} else {
  exportStore = configureStoreDev;
}

export default exportStore;
