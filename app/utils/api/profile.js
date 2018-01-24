// @flow
import config from 'config';
import jira from '../jiraClient';
import { getHeaders } from './helper';
import type { oAuthData } from '../../types';

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
  host: URL,
  username: string,
  password: string,
}): Promise<any> {
  const port = host.port.length ? host.port : '443';
  jira.auth(
    host.hostname,
    username,
    password,
    port,
    host.protocol,
  );
  return jiraProfile();
}

export function checkUserPlan({
  host,
}: {
  host: string,
}): Promise<*> {
  return fetch(`${config.apiUrl}/desktop-tracker/check-user-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      baseUrl: host,
    }),
  })
    .then(
      (res) => {
        const { status } = res;
        if (status === 200) {
          return res.json();
        }
        return { success: false };
      },
    )
    .then(
      (json: { success: boolean }) => json.success,
    );
}

export function chronosBackendAuth({
  host,
  username,
  password,
}: {
  host: URL,
  username: string,
  password: string,
}): Promise<*> {
  return fetch(`${config.apiUrl}/desktop-tracker/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'basic_auth',
      baseUrl: host.hostname,
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
  return fetch(`${config.apiUrl}/desktop-tracker/authenticate`, {
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

export function getOAuthUrl(options: any): Promise<*> {
  return new Promise((resolve) => {
    jira.getOAuthUrl(options, (err, res) => {
      if (err) {
        console.error(err);
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
      res => res,
    );
}

export async function chronosBackendGetJiraCredentials(): Promise<*> {
  const url: string = `${config.apiUrl}/desktop-tracker/authenticate`;
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
  const url: string = `${config.apiUrl}/desktop-tracker/getDataForOAuth?baseUrl=${baseUrl}`;
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
