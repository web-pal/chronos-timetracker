import { apiUrl } from 'config';
import jira from '../jiraClient';
import { getHeaders } from './helper';

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
      'Content-Type': 'image/png',
    },
    body: image,
  });
}
