import { apiUrl } from 'config';
import jira from '../jiraClient';
import { getHeaders } from './helper';


function clearHost(host) {
  let formatHost = host.startsWith('https://') ? host.slice(8) : host;
  formatHost = formatHost.startsWith('http://') ? formatHost.slice(7) : formatHost;
  return formatHost;
}

export function jiraProfile() {
  return jira.client.myself.getMyself();
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
  }).then(res => res.json());
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


export function chronosBackendGetJiraCredentials() {
  const url = `${apiUrl}/desktop-tracker/authenticate`;
  return fetch(url, { headers: getHeaders() }).then(res => res.json());
}

export function getDataForOAuth(baseUrl) {
  const url = `${apiUrl}/desktop-tracker/getDataForOAuth?baseUrl=${baseUrl}`;
  return fetch(
    url,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
}
