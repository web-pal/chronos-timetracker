// @flow
import config from 'config';

import type {
  Issue, Id,
} from 'types';
import {
  getHeaders,
} from './helper';

import client from './client';


export function fetchWorklogs(issues: Array<Issue>): Promise<*> {
  const promises = issues.map(issue => client.getWorkLogs({
    issueId: issue.id,
  }));
  return Promise.all(promises).then(results => [].concat(
    ...results.map(i => (i.worklogs ? i.worklogs : [])),
  ));
}

type WorklogRequest = {
  issueId: Id,
  adjustEstimate: 'auto',
  worklog: {
    timeSpentSeconds: number,
    comment: string,
  },
};

export async function chronosBackendUploadWorklog(worklog: any): Promise<*> {
  return fetch(`${config.apiUrl}/api/tracker/worklog`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(worklog),
  });
}

export async function signUploadUrlForS3Bucket(fileName: string): Promise<*> {
  const url = `${config.apiUrl}/desktop-tracker/sign-bucket-url`;
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

export function uploadScreenshotOnS3Bucket({
  url,
  image,
}: { url: string, image: string }): Promise<*> {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: image,
  });
}

export async function fetchWorklogTypes(): Promise<*> {
  const url = `${config.apiUrl}/api/tracker/settings/worklogTypes`;
  return fetch(url, { headers: await getHeaders() }).then(res => res.json());
}

export function addWorklog(opts: WorklogRequest): Promise<*> {
  return client.addWorkLog(opts);
}

export function updateWorklog(opts: WorklogRequest): Promise<*> {
  return client.updateWorkLog(opts);
}

export function deleteWorklog({
  issueId,
  worklogId,
  adjustEstimate,
}: {
  issueId: Id,
  worklogId: Id,
  adjustEstimate: string,
}): Promise<*> {
  return client.deleteWorkLog({ issueId, worklogId, adjustEstimate });
}
