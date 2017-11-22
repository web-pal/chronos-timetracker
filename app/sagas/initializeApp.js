import { call, put } from 'redux-saga/effects';
import { ipcRenderer } from 'electron';
import { uiActions, profileActions } from 'actions';
import * as Api from 'api';
import { initialize } from 'redux-form';

import { getFromStorage } from './storage';

export default function* initializeApp(): Generator<*, void, *> {
  const credentials = yield call(getFromStorage, 'jira_credentials');
  if (credentials) {
    const { host, username } = credentials;
    if (host) {
      yield put(uiActions.setAuthFormStep(2));
      const isPaidChronosUser = yield call(Api.checkUserPlan, { host });
      if (isPaidChronosUser) {
        // todo
      }
    }
    if (username) {
      const { password } = ipcRenderer.sendSync('get-credentials', username);
      if (password) {
        yield put(profileActions.loginRequest({ host, username, password }));
      } else {
        yield put(initialize('auth', { host, username, password: '' }));
      }
    }
  }
}
