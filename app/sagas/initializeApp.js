import { call, put } from 'redux-saga/effects';
import { ipcRenderer } from 'electron';
import { uiActions, profileActions } from 'actions';
import { initialize } from 'redux-form';

import { getFromStorage } from './storage';

export default function* initializeApp(): Generator<*, void, *> {
  const credentials = yield call(getFromStorage, 'jira_credentials');
  if (credentials) {
    const { host, username } = credentials;
    if (username) {
      const { password } = ipcRenderer.sendSync('get-credentials', username);
      const slicedHost = host.slice(0, host.indexOf('.'));
      yield put(initialize('auth', { host: slicedHost, username, password: '' }));
      yield put(uiActions.setAuthFormStep(2));
      if (password) {
        yield put(profileActions.loginRequest({ host, username, password }));
      }
    } else if (host) {
      const slicedHost = host.slice(0, host.indexOf('.'));
      yield put(initialize('auth', { host: slicedHost }));
      yield put(uiActions.setAuthFormStep(2));
    }
  }
}
