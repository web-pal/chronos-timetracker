import { race, take, put, call, cps } from 'redux-saga/effects';
import storage from 'electron-json-storage';
import Raven from 'raven-js';
import { ipcRenderer } from 'electron';
import {
  jiraAuth, chronosBackendAuth, chronosBackendOAuth,
  chronosBackendGetJiraCredentials, fetchSettings,
  getDataForOAuth, jiraProfile,
} from 'api';
import { getFromStorage } from './helper';
import * as types from '../constants/';
import { rememberToken, clearToken } from '../utils/api/helper';
import { login, loginOAuth, throwLoginError } from '../actions/profile';
import Socket from '../socket';
import jira from '../utils/jiraClient';


function* loginError(error) {
  yield put(throwLoginError(error));
  yield put({ type: types.SET_AUTH_STATE, payload: false });
}

function* jiraLogin(values) {
  let success = true;
  try {
    const userData = yield call(jiraAuth, values);
    Raven.setUserContext({
      locale: userData.locale,
      timeZone: userData.timeZone,
      name: userData.displayName,
      email: userData.emailAddress,
    });
    yield put({ type: types.FILL_PROFILE, payload: userData });
  } catch (err) {
    yield loginError('Cannot authorize to JIRA. Check your credentials and try again');
    success = false;
  }
  return success;
}

function* chronosBackendLogin(values) {
  let success = true;
  try {
    const { token } = yield call(chronosBackendAuth, values);
    yield storage.set('desktop_tracker_jwt', token);
    rememberToken(token);
  } catch (err) {
    yield loginError(err);
    success = false;
  }
  return success;
}

function* getSettings() {
  try {
    const { payload } = yield call(fetchSettings);
    yield put({ type: types.FILL_SETTINGS, payload });
  } catch (err) {
    console.log(err);
  }
}

export function* checkJWT() {
  yield take(types.CHECK_JWT);
  yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: true });
  try {
    const userData = yield call(chronosBackendGetJiraCredentials);
    if (userData.authType === 'basic_auth' || userData.authType === undefined) {
      yield put(login({ values: { ...userData, host: userData.baseUrl.split('.')[0] } }, false));
    }
    if (userData.authType === 'OAuth') {
      yield put(loginOAuth(
        {
          host: userData.baseUrl,
          aToken: userData.token,
          tSecret: userData.token_secret,
        },
        false,
      ));
    }
  } catch (err) {
    yield loginError('Automatic login failed, please enter your credentials again');
    yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
  }
}

export function* loginFlow() {
  while (true) {
    const { backendLogin, payload: { values, resolve } } = yield take(types.LOGIN_REQUEST);
    let chronosBackendLoginSuccess = !backendLogin;
    let jiraLoginSuccess = false;

    yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: true });
    jiraLoginSuccess = yield jiraLogin(values);
    if (jiraLoginSuccess && backendLogin) {
      storage.set('jira_credentials', { ...values, password: '' });
      chronosBackendLoginSuccess = yield chronosBackendLogin(values);
    }
    if (jiraLoginSuccess && chronosBackendLoginSuccess) {
      Raven.setExtraContext({ host: values.host });
      yield getSettings();
      yield put({ type: types.SET_CURRENT_HOST, payload: values.host });
      yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
      yield put({ type: types.SET_AUTH_STATE, payload: true });
      yield put({ type: types.CHECK_OFFLINE_SCREENSHOTS });
      yield put({ type: types.CHECK_OFFLINE_WORKLOGS });
      Socket.login();
      yield take(types.LOGOUT_REQUEST);
      yield cps(storage.remove, 'desktop_tracker_jwt');
      clearToken();
      yield put({ type: types.CLEAR_ALL_REDUCERS });
    }
    yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
    if (resolve) {
      resolve();
    }
  }
}

export function* loginOAuthFlow() {
  while (true) {
    const { backendLogin, payload: { host, aToken, tSecret } } =
      yield take(types.LOGIN_OAUTH_REQUEST);
    const chronosBackendLoginSuccess = !backendLogin;
    let accessToken = aToken;
    let tokenSecret = tSecret;

    yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: true });

    const oauth = yield call(getDataForOAuth, host);
    if (!chronosBackendLoginSuccess) {
      let oauthUrlData = {};
      try {
        oauthUrlData = yield cps(jira.getOAuthUrl, { oauth, host });
      } catch (err) {
        yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
        yield loginError('To use oauth ask your jira admin configure application link');
        continue; // eslint-disable-line
      }
      const { token, url } = oauthUrlData;
      tokenSecret = oauthUrlData.token_secret;
      ipcRenderer.send('open-oauth-url', url);

      const { haveCode, denied } = yield race({
        haveCode: take(types.LOGIN_OAUTH_HAVE_CODE),
        denied: take(types.LOGIN_OAUTH_DENIED),
      });
      if (denied) {
        yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
        yield loginError('OAuth denied');
        continue; // eslint-disable-line
      }
      accessToken =
        yield cps(
          jira.getOAuthToken,
          { host,
            oauth: {
              token,
              token_secret: tokenSecret,
              oauth_verifier: haveCode.code,
              consumer_key: oauth.consumerKey,
              private_key: oauth.privateKey,
            },
          },
        );
      const data = yield call(
        chronosBackendOAuth,
        { baseUrl: host, token: accessToken, token_secret: tokenSecret },
      );
      rememberToken(data.token);
      yield storage.set('desktop_tracker_jwt', data.token);
    }
    yield call(jira.oauth,
      { host,
        oauth: {
          token: accessToken,
          token_secret: tokenSecret,
          consumer_key: oauth.consumerKey,
          private_key: oauth.privateKey,
        },
      },
    );
    let userData = {};
    let jiraProfileError = false;
    try {
      userData = yield call(jiraProfile);
    } catch (err) {
      jiraProfileError = true;
      Raven.captureException(err);
    }
    if (jiraProfileError) {
      yield loginError('Cannot authorize to JIRA. Check your credentials and try again');
      yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
    } else {
      yield put({ type: types.FILL_PROFILE, payload: userData });
      Raven.setExtraContext({ host });
      yield getSettings();
      yield put({ type: types.SET_CURRENT_HOST, payload: host });
      yield put({ type: types.SET_LOGIN_REQUEST_STATE, payload: false });
      yield put({ type: types.SET_AUTH_STATE, payload: true });
      yield put({ type: types.CHECK_OFFLINE_SCREENSHOTS });
      yield put({ type: types.CHECK_OFFLINE_WORKLOGS });
      Socket.login();
      yield take(types.LOGOUT_REQUEST);
      yield cps(storage.remove, 'desktop_tracker_jwt');
      clearToken();
      yield put({ type: types.CLEAR_ALL_REDUCERS });
    }
  }
}

export function* localDesktopSettings() {
  while (true) {
    yield take(types.LOCAL_DESKTOP_SETTINGS_REQUEST);
    let settings = yield getFromStorage('localDesktopSettings');
    if (!Object.keys(settings).length) {
      settings = {
        showScreenshotPreview: true,
        screenshotPreviewTime: 15,
        nativeNotifications: true,
      };
      yield storage.set('localDesktopSettings', settings);
    }
    yield put({ type: types.FILL_LOCAL_DESKTOP_SETTINGS, payload: settings });
  }
}
