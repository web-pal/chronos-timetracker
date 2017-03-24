import path from 'path';

import { apiUrl } from 'config';
import jira from '../jiraClient';
import { getHeaders } from './helper';

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
  return jira.client.issue.addWorkLog(opts);
}

export function chronosBackendUploadWorklog({
  worklogId, issueId, comment,
  timeSpentSeconds, screensShot, activity,
}) {
  return fetch(`${apiUrl}/api/tracker/worklog`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      id: worklogId,
      worklog: {
        issueId,
        screensShot,
        description: comment,
        timeTracked: timeSpentSeconds,
        activity,
      },
    }),
  });
}

export function signUploadUrlForS3Bucket(screenshotPath) {
  const fileName = path.basename(screenshotPath);
  const url = `${apiUrl}/desktop-tracker/sign-bucket-url`;
  const options = {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ fileName }),
  };
  return fetch(url, options).then(res => res.json());
}

export function uploadScreenshotOnS3Bucket({ url, image }) {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/png',
    },
    body: image,
  });
}
