import JiraClient from 'jira-connector';
import storage from 'electron-json-storage';
import request from 'request';

import * as types from '../constants/jira';

export function connect(credentials) {
  return (dispatch) => new Promise((resolve) => {
    const { host, username, password, memorize } = credentials.toJS();
    const options = {
      method: 'POST',
      body: {
        host,
        username,
      },
    };
    request('http://localhost:5000/desktop-tracker', { method: 'POST', qs: { username, host } }, (err, res) => {
      console.log(res);
    });
    // const jiraClient = new JiraClient({
      // host,
      // basic_auth: {
        // username,
        // password,
      // },
    // });
    // dispatch({
      // type: types.CONNECT,
      // jiraClient,
      // credentials: {
        // host,
        // username,
        // memorize,
      // },
    // });
    // if (memorize) {
      // dispatch({
        // type: types.MEMORIZE_FORM,
        // data: {
          // host,
          // username,
        // },
      // });
    // }
    // resolve('done');
  });
}

export function getSelf() {
  return (dispatch, getState) => new Promise((resolve, reject) => {
    const client = getState().get('jira').client;
    client.myself.getMyself({}, (error, response) => {
      if (error) {
        dispatch({
          type: types.THROW_ERROR,
          error,
        });
        reject(error);
      }
      dispatch({
        type: types.GET_SELF,
        self: response,
      });
      resolve('done');
    });
  });
}

export function getSavedCredentials() {
  return (dispatch) => new Promise((resolve, reject) => {
    storage.get('jira_credentials', (error, credentials) => {
      if (error) {
        dispatch({
          type: types.THROW_ERROR,
          error,
        });
        reject();
      }
      dispatch({
        type: types.GET_SAVED_CREDENTIALS,
        credentials,
      });
      resolve('done');
    });
  });
}

export function setAuthSucceeded() {
  return {
    type: types.SET_AUTH_SUCCEEDED,
  };
}
