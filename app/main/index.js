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
  actionTypes,
} from 'shared/actions';

import store from './store';

if (
  process.env.NODE_ENV === 'development'
  || process.env.DEBUG_PROD
) {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload)),
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

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
