import React from 'react';
import {
  render as reactRender,
} from 'react-dom';
import {
  Provider,
} from 'react-redux';
import {
  hot,
  setConfig,
} from 'react-hot-loader';
import * as Sentry from '@sentry/electron';
import {
  ipcRenderer,
} from 'electron';

import App from './containers/App';
import store from './store';

import './assets/stylesheets/main.less';
import pjson from '../package.json';

require('smoothscroll-polyfill').polyfill();

setConfig({
  pureSFC: true,
});

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: `${pjson.version}_${process.platform}`,
    enableNative: false,
  });
}

window.onerror = (...argw) => {
  ipcRenderer.send('errorInWindow', argw);
};

const render = Component => (
  reactRender(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.getElementById('root') || document.createElement('div'),
  )
);

render(hot(module)(App));
