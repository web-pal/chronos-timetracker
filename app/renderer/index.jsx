import React from 'react';
import {
  render,
} from 'react-dom';
import {
  Provider,
} from 'react-redux';
import {
  AppContainer,
} from 'react-hot-loader';
import Raven from 'raven-js';
import {
  ipcRenderer,
} from 'electron';

import App from './containers/App';
import store from './store';

import './assets/stylesheets/main.less';

import pjson from '../package.json';

require('smoothscroll-polyfill').polyfill();

Raven.addPlugin(require('./raven-electron-plugin')); // eslint-disable-line
if (process.env.UPLOAD_SENTRY !== '0') {
  if (process.env.SENTRY_LINK) {
    Raven
      .config(process.env.SENTRY_LINK, {
        release: `${pjson.version}_${process.platform}`,
      })
      .install();
  }
}

window.onerror = (...argw) => {
  ipcRenderer.send('errorInWindow', argw);
};

render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
  document.getElementById('root') || document.createElement('div'),
);

if (module.hot) {
  // $FlowFixMe
  module.hot.accept('./containers/App', () => {
    const App = require('./containers/App'); // eslint-disable-line
    render(
      <AppContainer>
        <Provider store={store}>
          <App />
        </Provider>
      </AppContainer>,
      document.getElementById('root') || document.createElement('div'),
    );
  });
}
