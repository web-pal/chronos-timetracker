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
      yield put(initialize('auth', { host, username, password: '' }));
      yield put(uiActions.setAuthFormStep(2));
      if (password) {
        const loginData = {
          host: new URL(host),
          username,
          password,
        };
        yield put(profileActions.loginRequest(loginData));
      }
    } else if (host) {
      yield put(initialize('auth', { host }));
      yield put(uiActions.setAuthFormStep(2));
    }
  }
}
