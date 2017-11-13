// @flow
import { apiUrl } from '../config';
import jira from '../jiraClient';
import { getHeaders } from './helper';
import type { oAuthData } from '../../types';

function clearHost(host: string): string {
  let formatHost = host.startsWith('https://') ? host.slice(8) : host;
  formatHost = formatHost.startsWith('http://') ? formatHost.slice(7) : formatHost;
  return formatHost;
}

export function jiraProfile(): Promise<*> {
  return jira.client.myself.getMyself()
    .then(
      res => res,
    );
}

export function jiraAuth({
  host,
  username,
  password,
}: {
  host: string,
  username: string,
  password: string,
}): Promise<any> {
  const formatHost = `${clearHost(host)}.atlassian.net`;
  jira.auth(formatHost, username, password);
  return jiraProfile();
}

export function chronosBackendAuth({
  host,
  username,
  password,
}: {
  host: string,
  username: string,
  password: string,
}): Promise<*> {
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

export function chronosBackendOAuth({
  baseUrl,
  token,
  token_secret,
}: {
  baseUrl: string,
  token: string,
  token_secret: string,
}): Promise<*> {
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

export function getOAuthUrl(options: { oauth: oAuthData, host: string }): Promise<*> {
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

export function getOAuthToken(options: { oauth: oAuthData, host: string }): Promise<*> {
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

export async function chronosBackendGetJiraCredentials(): Promise<*> {
  const url: string = `${apiUrl}/desktop-tracker/authenticate`;
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

export function getDataForOAuth(baseUrl: string): Promise<*> {
  const url: string = `${apiUrl}/desktop-tracker/getDataForOAuth?baseUrl=${baseUrl}`;
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
