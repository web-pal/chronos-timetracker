// @flow
import * as eff from 'redux-saga/effects';
import {
  remote,
} from 'electron';
import * as Sentry from '@sentry/electron';

import * as actions from 'trello-actions';
import {
  trelloApi,
} from 'trello-api';
import config from 'config';
import {
  actionTypes as sharedActionTypes,
} from 'shared/actions';

import {
  getElectronStorage,
  setElectronStorage,
  savePersistStorage,
  throwError,
  notify,
} from './helpers';

const keytar = remote.require('keytar');

export function* takeInitialConfigureApp() {
  while (true) {
    const {
      key,
      token,
    } = yield eff.take(actions.actionTypes.INITIAL_CONFIGURE_APP);
    try {
      yield eff.call(
        trelloApi.setKeyAndToken,
        key,
        token,
      );
      const userData = yield eff.call(trelloApi.getMyself);
      yield eff.put(actions.setUiState({
        trelloUserId: userData.id,
        isAuthorized: true,
        initializeInProcess: false,
      }));
      yield eff.call(
        setElectronStorage,
        'last_used_account',
        {
          type: 'trello',
          trelloUserId: userData.id,
        },
      );
      yield eff.call(
        keytar.setPassword,
        'Chronos',
        `trello_${userData.id}`,
        token,
      );
    } catch (err) {
      yield eff.call(throwError, err);
      yield eff.put(actions.setUiState({
        isAuthorized: false,
        initializeInProcess: false,
      }));
    }
  }
}

export function* initializeApp(): Generator<*, *, *> {
  yield eff.put(actions.setUiState({
    initializeInProcess: true,
  }));
  try {
    const accounts = yield eff.call(
      getElectronStorage,
      'accounts',
      [],
    );
    yield eff.put(actions.setUiState({
      accounts,
    }));
    const authCredentials = yield eff.call(
      getElectronStorage,
      'last_used_account',
    );
    const authDataExist = (
      authCredentials !== null
      && authCredentials.type === 'trello'
      && authCredentials.trelloUserId
    );
    if (authDataExist) {
      try {
        const trelloApiToken = yield eff.call(
          keytar.getPassword,
          'Chronos',
          `trello_${authCredentials.trelloUserId}`,
        );
        yield eff.put(actions.setUiState({
          isAuthorized: true,
          trelloApiToken,
        }));
        yield eff.put(actions.initialConfigureApp({
          key: config.trelloApiKey,
          token: trelloApiToken,
        }));
      } catch (error) {
        Sentry.captureMessage('keytar error!', {
          level: 'error',
          extra: {
            error,
          },
        });
        yield eff.call(
          throwError,
          error,
        );
        if (process.platform === 'linux') {
          yield eff.fork(
            notify,
            {
              type: 'libSecretError',
              autoDelete: false,
            },
          );
        }
      }
    } else {
      yield eff.put(actions.setUiState({
        initializeInProcess: false,
        isAuthorized: false,
      }));
    }
  } catch (err) {
    yield eff.call(throwError, err);
    yield eff.put(actions.setUiState({
      initializeInProcess: false,
      isAuthorized: false,
    }));
  }
}

export function* handleQuitRequest(): Generator<*, *, *> {
  while (true) {
    yield eff.take(sharedActionTypes.QUIT_REQUEST);
    yield eff.call(savePersistStorage);
    yield eff.put(actions.setUiState({
      readyToQuit: true,
    }));
    if (process.env.NODE_ENV === 'development') {
      window.location.reload();
    } else {
      remote.app.quit();
    }
  }
}
