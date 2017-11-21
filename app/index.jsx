// @flow
import React from 'react';
import type { Node, StatelessFunctionalComponent } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import Raven from 'raven-js';
import { ipcRenderer } from 'electron';

import App from './containers/App';
import store from './store';

import './assets/stylesheets/main.less';

import pjson from '../package.json';

require('smoothscroll-polyfill').polyfill();

Raven.addPlugin(require('./raven-electron-plugin')); // eslint-disable-line
if (process.env.UPLOAD_SENTRY !== '0') {
  Raven
    .config('https://60a0dae4681d47d29a4cd77703472a29@sentry.io/153064', {
      release: `${pjson.version}_${process.platform}`,
    })
    .install();
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
  module.hot.accept('./containers/App', () => {
    // $FlowFixMe
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
