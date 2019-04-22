/* eslint-disable no-console, no-param-reassign, global-require */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import {
  app,
  BrowserWindow,
} from 'electron';
import {
  init,
} from '@sentry/electron/dist/main';

import {
  actionTypes,
} from 'shared/actions';

import store from './store';
import pjson from '../../package.json';

app.setAppUserModelId(pjson.build.appId);

if (
  process.env.NODE_ENV === 'development'
  || process.env.DEBUG_PROD
) {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}
if (process.env.NODE_ENV === 'production') {
  init({
    dsn: process.env.SENTRY_DSN,
    enableNative: false,
  });
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload)),
  ).catch(console.log);
};

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development'
    || process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  store.dispatch({ type: actionTypes.INITIAL });
});

app.on('activate', () => {
  BrowserWindow
    .getAllWindows()
    .filter(win => win.id === 1)
    .forEach(win => win.show());
});

app.on('before-quit', () => {
  store.dispatch({
    type: actionTypes.SET_WILL_QUIT_STATE,
    payload: true,
  });
});
