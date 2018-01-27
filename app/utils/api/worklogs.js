// @flow
import config from 'config';

import jira from '../jiraClient';
import { getHeaders } from './helper';

import type { Issue, Id } from '../../types';

export function fetchWorklogs(issues: Array<Issue>): Promise<*> {
  return new Promise((resolve) => {
    const promises = issues.map(issue => (
      // eslint-disable-next-line promise/param-names
      new Promise((resolve2) => {
        jira.client.issue.getWorkLogs({
          issueId: issue.id,
        }, (err, response) => {
          resolve2(response ? response.worklogs : []);
        });
      })
    ));
    return Promise.all(promises).then((results) => {
      const items = [].concat(...results.map(i => i));
      resolve(items);
      return items;
    });
  });
}

export async function fetchChronosBackendWorklogs(ids: Array<Id>): Promise<*> {
  return fetch(`${config.apiUrl}/api/tracker/worklogs?worklogIds=${ids.join(',')}`, {
    method: 'GET',
    headers: await getHeaders(),
  }).then(res => res.json());
}

type jiraUploadOptions = {
  issueId: Id,
  adjustEstimate: 'auto',
  worklog: {
    timeSpentSeconds: number,
    comment: string,
  },
};

export function jiraUploadWorklog(opts: jiraUploadOptions): Promise<*> {
  return jira.client.issue.addWorkLog(opts);
}

export async function chronosBackendUploadWorklog(worklog: any): Promise<*> {
  return fetch(`${config.apiUrl}/api/tracker/worklog`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(worklog),
  });
}

export async function chronosBackendUpdateWorklogType({
  worklogType,
  worklogId,
}: { worklogType: string, worklogId: string }): Promise<*> {
  const url = `${config.apiUrl}/api/tracker/updateWorklogType`;
  const options = {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ worklogType, worklogId }),
  };
  return fetch(url, options);
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

export function addWorklog(opts: jiraUploadOptions): Promise<*> {
  return jira.client.issue.addWorkLog(opts);
}

export function deleteWorklog({
  issueId,
  worklogId,
  adjustEstimate,
}: {
  issueId: string,
  worklogId: string,
  adjustEstimate: string,
}): Promise<*> {
  return jira.client.issue.deleteWorkLog({ issueId, worklogId, adjustEstimate });
}

export function updateWorklog(opts: jiraUploadOptions): Promise<*> {
  return jira.client.issue.updateWorkLog(opts);
}
