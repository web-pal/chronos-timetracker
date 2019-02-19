// @flow
import * as eff from 'redux-saga/effects';
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
    } = yield eff.take(actionTypes.AUTH_SELF_HOST_REQUEST);
    try {
      yield eff.put(uiActions.setUiState({
        authRequestInProcess: true,
      }));
      const { href, hostname, port, pathname } = host;
      const protocol = host.protocol.slice(0, -1);
      const cookies = yield eff.call(authSelfHosted, {
        pathname,
        protocol,
        username,
        password,
        baseUrl: href.replace(/\/$/, ''),
      });
      yield eff.put(authActions.authRequest({
        protocol,
        hostname,
        port,
        pathname,
        cookies,
      }));
    } catch (err) {
      if (err && err.message) {
        yield eff.put(uiActions.setUiState('authError', err.message));
      } else {
        yield eff.put(uiActions.setUiState(
          'authError',
          'Can not authenticate user. Please try again',
        ));
      }
      yield eff.call(throwError, err);
      yield eff.put(uiActions.setUiState('authRequestInProcess', false));
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
      } = yield eff.take(actionTypes.AUTH_REQUEST);
      yield eff.put(uiActions.setUiState({
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
        yield eff.all(
          clearedCookies.map(cookie => (
            eff.call(
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
      yield eff.call(
        jiraApi.setRootUrl,
        rootApiUrl,
      );

      /* Test request for check auth */
      const { name } = yield eff.call(jiraApi.getMyself);
      const account = {
        name,
        protocol,
        hostname,
        port,
        pathname,
      };

      yield eff.call(
        setElectronStorage,
        'last_used_account',
        account,
      );

      const accounts = yield eff.call(
        getElectronStorage,
        'accounts',
        [],
      );
      if (!R.find(R.whereEq({ name, hostname }), accounts)) {
        accounts.push(account);
        yield eff.call(
          setElectronStorage,
          'accounts',
          accounts,
        );
      }

      yield eff.call(
        keytar.setPassword,
        'Chronos',
        `${name}_${hostname}`,
        JSON.stringify(clearedCookies),
      );

      yield eff.put(
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
        yield eff.put(authActions.addAuthDebugMessage([
          {
            json: err.debug,
          },
        ]));
      }
      yield eff.put(uiActions.setUiState({
        authRequestInProcess: false,
        authFormStep: 1,
        authFormIsComplete: false,
        initializeInProcess: false,
        authorized: false,
        authError: 'Can not authenticate user. Please try again',
      }));
      yield eff.call(throwError, err.result ? err.result : err);
    }
  }
}


export function* logoutFlow(): Generator<*, *, *> {
  while (true) {
    const { forget } = yield eff.take(actionTypes.LOGOUT_REQUEST);
    try {
      const running = yield eff.select(getTimerState('running'));
      const saveWorklogInProcess = yield eff.select(getUiState2('saveWorklogInProcess'));

      if (running) {
        // eslint-disable-next-line no-alert
        window.alert('Tracking in progress, save worklog before logout!');
      }
      if (saveWorklogInProcess) {
        // eslint-disable-next-line no-alert
        window.alert('Currently app in process of saving worklog, wait few seconds please');
      }
      yield eff.call(
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

      const lastUsedAccount = yield eff.call(
        getElectronStorage,
        'last_used_account',
        null,
      );
      let accounts = yield eff.call(
        getElectronStorage,
        'accounts',
        [],
      );
      if (
        !running
        && !saveWorklogInProcess
        && lastUsedAccount
      ) {
        yield eff.call(
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
          yield eff.put(uiActions.setUiState({
            accounts,
          }));
          yield eff.call(
            setElectronStorage,
            'accounts',
            accounts,
          );
        }
      }
      yield eff.call(savePersistStorage);
      yield eff.put({
        type: actionTypes.__CLEAR_ALL_REDUCERS__,
      });
      yield eff.put(uiActions.setUiState({
        accounts,
      }));
      trackMixpanel('Logout');
      incrementMixpanel('Logout', 1);
    } catch (err) {
      yield eff.call(throwError, err);
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
    } = yield eff.take(actionTypes.SWITCH_ACCOUNT);
    try {
      const saveWorklogInProcess = yield eff.select(getUiState2('saveWorklogInProcess'));
      const running = yield eff.select(getTimerState('running'));

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
        const cookiesStr = yield eff.call(
          keytar.getPassword,
          'Chronos',
          `${name}_${hostname}`,
        );
        const cookies = JSON.parse(cookiesStr);
        yield eff.call(
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
        yield eff.put({
          type: actionTypes.__CLEAR_ALL_REDUCERS__,
        });
        yield eff.put(uiActions.setUiState({
          initializeInProcess: true,
        }));
        yield eff.put(authActions.authRequest({
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
      yield eff.call(throwError, err);
    }
  }
}
