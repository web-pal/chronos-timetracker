import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import Raven from 'raven-js';
import fs from 'fs';
import rimraf from 'rimraf';
import { remote, ipcRenderer as ipc } from 'electron';
import { useSentry } from 'config';

import Base from './components/Base/Base';
import store from './store';

import pjson from './package.json';
import './assets/stylesheets/main.less';


Raven.addPlugin(require('./raven-electron-plugin')); // eslint-disable-line
if (useSentry) {
  Raven
    .config('https://60a0dae4681d47d29a4cd77703472a29@sentry.io/153064', {
      release: `${pjson.version}_${process.platform}`,
    })
    .install();
}

// TODO: Move it to saga
// Create directories for screens and worklogs
const appDir = remote.getGlobal('appDir');
try {
  fs.accessSync(`${appDir}/screens/`, fs.constants.R_OK | fs.constants.W_OK); // eslint-disable-line
} catch (err) {
  fs.mkdirSync(`${appDir}/screens/`);
}
try {
  fs.accessSync(`${appDir}/offline_screens/`, fs.constants.R_OK | fs.constants.W_OK); // eslint-disable-line
} catch (err) {
  fs.mkdirSync(`${appDir}/offline_screens/`);
}
try {
  fs.accessSync(`${appDir}/worklogs/`, fs.constants.R_OK | fs.constants.W_OK) // eslint-disable-line
} catch (err) {
  fs.mkdirSync(`${appDir}/worklogs/`);
}

window.onerror = (...argw) => {
  ipc.send('errorInWindow', argw);
};

render(
  <AppContainer>
    <Provider store={store}>
      <Base />
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./components/Base/Base', () => {
    const Base = require('./components/Base/Base'); // eslint-disable-line
    render(
      <AppContainer>
        <Provider store={store}>
          <Base />
        </Provider>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
