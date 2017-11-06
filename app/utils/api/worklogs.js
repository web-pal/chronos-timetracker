import { apiUrl } from 'config';
import { sendInfoLog } from 'log-util';

import jira from '../jiraClient';
import { getHeaders } from './helper';

// Can we fetch only current author worklogs? -- no.
export function fetchWorklogs(issues) {
  return new Promise((resolve) => {
    const promises = issues.map(issue => (
      new Promise((resolve) => {
        jira.client.issue.getWorkLogs({
          issueId: issue.id,
        }, (err, response) => {
          resolve(response ? response.worklogs : []);
        });
      })
    ));
    Promise.all(promises).then((results) => {
      const items = [].concat(...results.map(i => i));
      resolve(items);
    });
  });
}

export async function fetchChronosBackendWorklogs(ids) {
  sendInfoLog('call fetchChronosBackendWorklogs', { ids });
  return fetch(`${apiUrl}/api/tracker/worklogs?worklogIds=${ids.join(',')}`, {
    method: 'GET',
    headers: await getHeaders(),
  }).then(res => res.json());
}

export function jiraUploadWorklog(opts) {
  sendInfoLog('call jiraUploadWorklog', opts);
  return jira.client.issue.addWorkLog(opts);
}

export function jiraSetWorklogProperty(opts) {
  sendInfoLog('call jiraSetWorklogProperty', opts);
  return jira.client.issue.setWorklogProperty(opts);
}

export function jiraGetWorklogPropertyKeys(opts) {
  sendInfoLog('call jiraGetWorklogPropertyKeys', opts);
  return jira.client.issue.getWorkLogProperties(opts);
}


export function jiraGetWorklogProperty(opts) {
  sendInfoLog('call jiraGetWorklogProperty', opts);
  return jira.client.issue.getWorkLogProperty(opts);
}

export async function chronosBackendUploadWorklog(worklog) {
  sendInfoLog('call chronosBackendUploadWorklog', worklog);
  return fetch(`${apiUrl}/api/tracker/worklog`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(worklog),
  });
}

export async function chronosBackendUpdateWorklogType({ worklogType, worklogId }) {
  const url = `${apiUrl}/api/tracker/updateWorklogType`;
  const options = {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ worklogType, worklogId }),
  };
  return fetch(url, options);
}


export async function signUploadUrlForS3Bucket(fileName) {
  const url = `${apiUrl}/desktop-tracker/sign-bucket-url`;
  const options = {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ fileName }),
  };
  return fetch(url, options)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw Error(res.statusText);
    });
}

export function uploadScreenshotOnS3Bucket({ url, image }) {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: image,
  });
}

export async function fetchWorklogTypes() {
  const url = `${apiUrl}/api/tracker/settings/worklogTypes`;
  return fetch(url, { headers: await getHeaders() }).then(res => res.json());
}

export function addWorklog(opts) {
  return jira.client.issue.addWorkLog(opts);
}

export function deleteWorklog(opts) {
  return jira.client.issue.deleteWorkLog(opts);
}

export function updateWorklog(opts) {
  return jira.client.issue.updateWorkLog(opts);
}
