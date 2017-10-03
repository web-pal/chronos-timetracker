import { apiUrl } from 'config';
import jira from '../jiraClient';
import { getHeaders } from './helper';


function clearHost(host) {
  let formatHost = host.startsWith('https://') ? host.slice(8) : host;
  formatHost = formatHost.startsWith('http://') ? formatHost.slice(7) : formatHost;
  return formatHost;
}

export function jiraProfile() {
  return jira.client.myself.getMyself()
    .then(
      res => res,
    );
}

export function jiraAuth({ host, username, password }) {
  const formatHost = `${clearHost(host)}.atlassian.net`;
  jira.auth(formatHost, username, password);
  return jiraProfile();
}

export function chronosBackendAuth({ host, username, password }) {
  return fetch(`${apiUrl}/desktop-tracker/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'basic_auth',
      baseUrl: `${clearHost(host)}.atlassian.net`,
      username,
      password,
    }),
  })
    .then((res) => {
      if (res.status > 400) {
        throw new Error('Cannot authorize to JIRA. Check your credentials and try again');
      }
      return res.json();
    });
}

export function chronosBackendOAuth({ baseUrl, token, token_secret }) {
  return fetch(`${apiUrl}/desktop-tracker/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'OAuth',
      baseUrl,
      token,
      token_secret,
    }),
  }).then(res => res.json());
}

export function getOAuthUrl(options) {
  return new Promise((resolve) => {
    jira.getOAuthUrl(options, (err, res) => {
      if (err) {
        throw new Error('To use oAuth ask your jira admin configure application link');
      }
      resolve(res);
    });
  })
    .then(
      res => ({
        ...res,
        tokenSecret: res.token_secret,
      }),
    );
}

export function getOAuthToken(options) {
  return new Promise((resolve) => {
    jira.getOAuthToken(options, (err, res) => {
      if (err) {
        throw new Error(`Error getting oAuth token: ${err.message}`);
      }
      resolve(res);
    });
  })
    .then(
      (res) => res,
    );
}

export function oAuth(options) {
  return new Promise((resolve) => {
    jira.oauth(options, (err, res) => {
      if (err) {
        throw new Error(`Error with oAuth: ${err.message}`);
      }
      resolve(res);
    });
  })
    .then(
      (res) => res,
    );
}


export async function chronosBackendGetJiraCredentials() {
  const url = `${apiUrl}/desktop-tracker/authenticate`;
  return fetch(url, {
    headers: await getHeaders(),
  })
    .then((res) => {
      if (res.status > 400) {
        throw new Error('Automatic login failed, please enter your credentials again');
      }
      return res.json();
    });
}

export function getDataForOAuth(baseUrl) {
  const url = `${apiUrl}/desktop-tracker/getDataForOAuth?baseUrl=${baseUrl}`;
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(
      (res) => {
        if (res.status > 400) {
          return new Error(`Unknown error (/getDataForOAuth returned ${res.status})`);
        }
        return res.json();
      },
    );
}
