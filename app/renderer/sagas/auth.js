// @flow
import {
  take,
  call,
  all,
  select,
  put,
} from 'redux-saga/effects';
import {
  remote,
} from 'electron';

import {
  jiraApi,
  authSelfHosted,
} from 'api';
import * as R from 'ramda';

import {
  trackMixpanel,
  incrementMixpanel,
} from 'utils/stat';

import {
  actionTypes,
  authActions,
  uiActions,
} from 'actions';
import {
  getTimerState,
  getUiState2,
} from 'selectors';

import {
  getElectronStorage,
  setElectronStorage,
  removeElectronStorage,
  savePersistStorage,
} from './helpers';
import {
  throwError,
} from './ui';

const keytar = remote.require('keytar');


export function* authSelfHostedFlow(): Generator<*, *, *> {
  while (true) {
    const {
      payload: {
        username,
        password,
        host,
      },
    } = yield take(actionTypes.AUTH_SELF_HOST_REQUEST);
    try {
      yield put(uiActions.setUiState({
        authRequestInProcess: true,
      }));
      const { href, hostname, port, pathname } = host;
      const protocol = host.protocol.slice(0, -1);
      const cookies = yield call(authSelfHosted, {
        pathname,
        protocol,
        username,
        password,
        baseUrl: href.replace(/\/$/, ''),
      });
      yield put(authActions.authRequest({
        protocol,
        hostname,
        port,
        pathname,
        cookies,
      }));
    } catch (err) {
      if (err && err.message) {
        yield put(uiActions.setUiState({
          authError: err.message,
        }));
      } else {
        yield put(uiActions.setUiState({
          authError: 'Can not authenticate user. Please try again',
        }));
      }
      yield call(throwError, err);
      yield put(uiActions.setUiState({
        authRequestInProcess: false,
      }));
    }
  }
}

function setCookie(cookie) {
  return new Promise((
    (resolve, reject) => {
      remote.session.defaultSession.cookies.set(
        cookie,
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(cookie);
          }
        },
      );
    }
  ));
}

export function* authFlow(): Generator<*, *, *> {
  while (true) {
    try {
      const {
        protocol,
        hostname,
        port,
        pathname,
        cookies,
      } = yield take(actionTypes.AUTH_REQUEST);
      yield put(uiActions.setUiState({
        authRequestInProcess: true,
      }));

      const clearedCookies = (
        cookies.map(cookie => ({
          url: `${protocol}://${hostname}`,
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          httpOnly: protocol === 'http',
          expires: 'Fri, 31 Dec 9999 23:59:59 GMT',
        }))
      );
      try {
        yield all(
          clearedCookies.map(cookie => (
            call(
              setCookie,
              cookie,
            )
          )),
        );
      } catch (err) {
        console.log(err);
      }

      const p = port ? `:${port}` : '';
      const rootApiUrl = `${protocol}://${hostname}${p}${pathname.replace(/\/$/, '')}`;
      yield call(
        jiraApi.setRootUrl,
        rootApiUrl,
      );

      /* Test request for check auth */
      const { name } = yield call(jiraApi.getMyself);
      const account = {
        name,
        protocol,
        hostname,
        port,
        pathname,
      };

      yield call(
        setElectronStorage,
        'last_used_account',
        account,
      );

      const accounts = yield call(
        getElectronStorage,
        'accounts',
        [],
      );
      if (!R.find(R.whereEq({ name, hostname }), accounts)) {
        accounts.push(account);
        yield call(
          setElectronStorage,
          'accounts',
          accounts,
        );
      }

      yield call(
        keytar.setPassword,
        'Chronos',
        `${name}_${hostname}`,
        JSON.stringify(clearedCookies),
      );

      yield put(
        uiActions.initialConfigureApp(
          {
            protocol,
            hostname,
            port,
            pathname,
            rootApiUrl,
          },
        ),
      );

      trackMixpanel('Jira login');
      incrementMixpanel('Jira login', 1);
    } catch (err) {
      if (err.debug) {
        console.log(err.debug);
        yield put(authActions.addAuthDebugMessage([
          {
            json: err.debug,
          },
        ]));
      }
      yield put(uiActions.setUiState({
        authRequestInProcess: false,
        authFormStep: 1,
        authFormIsComplete: false,
        initializeInProcess: false,
        authorized: false,
        authError: 'Can not authenticate user. Please try again',
      }));
      yield call(throwError, err.result ? err.result : err);
    }
  }
}


export function* logoutFlow(): Generator<*, *, *> {
  while (true) {
    const { forget } = yield take(actionTypes.LOGOUT_REQUEST);
    try {
      const running = yield select(getTimerState('running'));
      const saveWorklogInProcess = yield select(getUiState2('saveWorklogInProcess'));

      if (running) {
        // eslint-disable-next-line no-alert
        window.alert('Tracking in progress, save worklog before logout!');
      }
      if (saveWorklogInProcess) {
        // eslint-disable-next-line no-alert
        window.alert('Currently app in process of saving worklog, wait few seconds please');
      }
      yield call(
        remote.session.defaultSession.clearStorageData,
        {
          quotas: [
            'temporary',
            'persistent',
            'syncable',
          ],
          storages: [
            'appcache',
            'cookies',
            'filesystem',
            'indexdb',
            'localstorage',
            'shadercache',
            'websql',
            'serviceworkers',
            'cachestorage',
          ],
        },
      );

      const lastUsedAccount = yield call(
        getElectronStorage,
        'last_used_account',
        null,
      );
      let accounts = yield call(
        getElectronStorage,
        'accounts',
        [],
      );
      if (
        !running
        && !saveWorklogInProcess
        && lastUsedAccount
      ) {
        yield call(
          removeElectronStorage,
          'last_used_account',
        );
        if (forget) {
          accounts = accounts.filter(
            a => (
              a.name !== lastUsedAccount.name
              && a.hostname !== lastUsedAccount.hostname
            ),
          );
          yield put(uiActions.setUiState({
            accounts,
          }));
          yield call(
            setElectronStorage,
            'accounts',
            accounts,
          );
        }
      }
      yield call(savePersistStorage);
      yield put({
        type: actionTypes.__CLEAR_ALL_REDUCERS__,
      });
      yield put(uiActions.setUiState({
        accounts,
      }));
      trackMixpanel('Logout');
      incrementMixpanel('Logout', 1);
    } catch (err) {
      yield call(throwError, err);
    }
  }
}

export function* switchAccountFlow(): Generator<*, *, *> {
  while (true) {
    const {
      name,
      protocol,
      hostname,
      port,
      pathname,
    } = yield take(actionTypes.SWITCH_ACCOUNT);
    try {
      const saveWorklogInProcess = yield select(getUiState2('saveWorklogInProcess'));
      const running = yield select(getTimerState('running'));

      if (running) {
        // eslint-disable-next-line no-alert
        window.alert('Tracking in progress, save worklog before logout!');
      }
      if (saveWorklogInProcess) {
        // eslint-disable-next-line no-alert
        window.alert('Currently app in process of saving worklog, wait few seconds please');
      }
      if (
        !running
        && !saveWorklogInProcess
      ) {
        const cookiesStr = yield call(
          keytar.getPassword,
          'Chronos',
          `${name}_${hostname}`,
        );
        const cookies = JSON.parse(cookiesStr);
        yield call(
          remote.session.defaultSession.clearStorageData,
          {
            quotas: [
              'temporary',
              'persistent',
              'syncable',
            ],
            storages: [
              'appcache',
              'cookies',
              'filesystem',
              'indexdb',
              'localstorage',
              'shadercache',
              'websql',
              'serviceworkers',
              'cachestorage',
            ],
          },
        );
        yield put({
          type: actionTypes.__CLEAR_ALL_REDUCERS__,
        });
        yield put(uiActions.setUiState({
          initializeInProcess: true,
        }));
        yield put(authActions.authRequest({
          protocol,
          hostname,
          port,
          pathname,
          cookies,
        }));
        trackMixpanel('SwitchAccounts');
        incrementMixpanel('SwitchAccounts', 1);
      }
    } catch (err) {
      yield call(throwError, err);
    }
  }
}
