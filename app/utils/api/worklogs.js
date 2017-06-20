import { apiUrl } from 'config';
import jira from '../jiraClient';
import { getHeaders } from './helper';
import { sendInfoLog } from '../../helpers/log';

// Can we fetch only current author worklogs?
export function fetchWorklogs(issues) {
  return new Promise((resolve) => {
    const promises = issues.map(issue => (
      new Promise((r) => {
        jira.client.issue.getWorkLogs({
          issueId: issue.id,
        }, (err, response) => {
          r(response ? response.worklogs : []);
        });
      })
    ));
    Promise.all(promises).then((results) => {
      const items = [].concat(...results.map(i => i));
      resolve(items);
    });
  });
}

export function jiraUploadWorklog(opts) {
  sendInfoLog('call jiraUploadWorklog', opts);
  return jira.client.issue.addWorkLog(opts);
}

export function chronosBackendUploadWorklog(worklog) {
  sendInfoLog('call chronosBackendUploadWorklog', worklog);
  return fetch(`${apiUrl}/api/tracker/worklog`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(worklog),
  });
}

export function signUploadUrlForS3Bucket(fileName) {
  const url = `${apiUrl}/desktop-tracker/sign-bucket-url`;
  const options = {
    method: 'POST',
    headers: getHeaders(),
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

export function fetchWorklogTypes() {
  const url = `${apiUrl}/api/tracker/settings/worklogTypes`;
  return fetch(url, { headers: getHeaders() }).then(res => res.json());
}
