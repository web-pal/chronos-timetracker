import fs from 'fs';
import rimraf from 'rimraf';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { remote, ipcRenderer as ipc } from 'electron';
import { AppContainer } from 'react-hot-loader';

import Base from './components/Base/Base';
import store from './store';

import './assets/stylesheets/main.less';

// Create directories for screens and worklogs
const appDir = remote.getGlobal('appDir');
try {
  fs.accessSync(`${appDir}/screens/`, fs.constants.R_OK | fs.constants.W_OK); // eslint-disable-line
} catch (err) {
  fs.mkdirSync(`${appDir}/screens/`);
}
// Remove legacy dir, after few versions we will remove this code (0.0.9)
try {
  fs.accessSync(`${appDir}/screenshots/`, fs.constants.R_OK | fs.constants.W_OK) // eslint-disable-line
  rimraf(`${appDir}/screenshots/`, () => console.log('removed old screenshots'));
} catch (err) {
  console.log(err);
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
  document.getElementById('root'),
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
      document.getElementById('root'),
    );
  });
}
