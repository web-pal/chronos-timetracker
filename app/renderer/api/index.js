// @flow
import {
  remote,
} from 'electron';
import querystring from 'querystring';

import apiFactory from './jiraApi';
import enhancedFetch from './enhancedFetch';


export const jiraApi = apiFactory({
  makeRequest: enhancedFetch,
});

export function authSelfHosted(
  payload: {
    pathname: string,
    protocol: string,
    username: string,
    password: string,
    baseUrl: string,
  },
): Promise<*> {
  const handleNetError = (error: string): string => ({
    'Error: net::ERR_INTERNET_DISCONNECTED': 'Internet disconnected',
    'Error: net::ERR_PROXY_CONNECTION_FAILED': 'Proxy connection failed',
    'Error: net::ERR_CONNECTION_RESET': 'Connection reset',
    'Error: net::ERR_CONNECTION_CLOSE': 'Connection close',
    'Error: net::ERR_NAME_NOT_RESOLVED': 'Page unavailable',
    'Error: net::ERR_CONNECTION_TIMED_OUT': 'Connection timed out',
  }[error] || 'Unknown Error');

  const {
    pathname,
    protocol,
    username,
    password,
    baseUrl,
  } = payload;
  const url: string = `${baseUrl}/jira/rest/gadget/1.0/login`;
  const request = remote.net.request({
    url,
    method: 'POST',
  });
  const form = {
    os_username: username,
    os_password: password,
    os_cookie: true,
  };
  const postData = querystring.stringify(form);
  return new Promise((resolve, reject) => {
    request.on('response', (response) => {
      const cookie = response.headers['set-cookie'];
      if (response?.headers['x-seraph-loginreason']?.includes('OK')) {
        resolve(cookie.map((d) => {
          const name = d.split('=')[0];
          const value = d.split(`${name}=`)[1].split(';')[0];
          return ({
            path: pathname,
            name,
            value,
            httpOnly: protocol === 'http',
            expires: 'Fri, 31 Dec 9999 23:59:59 GMT',
          });
        }));
      }
      reject(new Error('Incorrect email address and / or password.'));
    });
    request.on('error', (error) => {
      reject(new Error(handleNetError(error)));
    });
    request.setHeader(
      'Content-Type',
      'application/x-www-form-urlencoded',
    );
    request.setHeader(
      'Content-Length',
      Buffer.byteLength(postData),
    );
    request.write(postData);
    request.end();
  });
}
