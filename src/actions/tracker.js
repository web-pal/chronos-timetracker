import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import fetch from 'isomorphic-fetch';

import * as types from '../constants/tracker';
import { success, fail } from '../helpers/promise';

export function tick() {
  return {
    type: types.TICK,
  };
}

export function startTimer() {
  return (dispatch, getState) => {
    const { getGlobal } = remote;
    const currentIssue = getState().get('context').currentIssue.toJS();
    const worklog = {
      issue: {
        issueId: currentIssue.id,
        summary: currentIssue.fields.summary,
      },
      screenshots: [],
      timeTracked: 0,
      submitted: false,
    };
    const appDir = getGlobal('appDir');
    const worklogsDir = `${appDir}/worklogs`;
    const worklogId = Date.now();
    const worklogFile = `${worklogsDir}/${worklogId}.worklog`;
    fs.writeFile(worklogFile, JSON.stringify(worklog, null, 2), (err) => {
      if (err) throw err;
    });
    dispatch({
      type: types.START,
      worklogId,
    });
  };
}

export function pauseTimer() {
  return {
    type: types.PAUSE,
  };
}

export function stopTimer() {
  return (dispatch, getState) => {
    const token = getState().get('jira').jwt;
    const jiraClient = getState().get('jira').client;
    const currentIssue = getState().get('context').currentIssue;
    const { getGlobal } = remote;
    const currentWorklogId = getState().get('tracker').currentWorklogId;
    const appDir = getGlobal('appDir');
    const worklogsDir = `${appDir}/worklogs`;
    const worklogFile = `${worklogsDir}/${currentWorklogId}.worklog`;
    fs.readFile(worklogFile, (err, file) => {
      const url = 'http://localhost:5000/desktop-tracker/submit-worklog';
      const worklog = JSON.parse(file);
      const opts = {
        issueId: currentIssue.get('id'),
        worklog: {
          comment: 'a fresh baked automatic worklog',
          timeSpentSeconds: worklog.timeTracked,
        },
      };
      jiraClient.issue.addWorkLog(opts, (error, status, response) => {
        if (error) {
          console.error(error);
          dispatch({
            type: types.THROW_ERROR,
            error,
          });
        }
        const { id } = response.body;
        const options = {
          method: 'POST',
          body: JSON.stringify({ worklog, id }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };
        fetch(url, options)
          .then(
            (res) => {
              if (res.status === 200) {
                worklog.submitted = true;
                worklog.id = id;
                fs.writeFile(worklogFile, JSON.stringify(worklog, null, 4));
              }
            }
          );
      });
      dispatch({
        type: types.STOP,
      });
    });
  };
}

export function rejectScreenshot(lastScreenshotTime) {
  return {
    type: types.REJECT_SCREENSHOT,
    lastScreenshotTime,
  };
}

function uploadScreenshot(screenshotPath) {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(screenshotPath);
    const url = 'http://localhost:5000/desktop-tracker/sign-bucket-url';
    const options = {
      method: 'POST',
      body: JSON.stringify({ fileName }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(url, options)
      .then(
        res => res.status === 200 && res.json()
      )
      .then(
        (json) => {
          const signedUrl = json.url;
          fs.readFile(screenshotPath, (err2, image) => {
            if (err2) reject(fail(err2));
            const opts = {
              method: 'PUT',
              headers: {
                'Content-Type': 'image/jpeg',
              },
              body: image,
            };
            return fetch(signedUrl, opts);
          });
        }
      )
      .then(
        () => resolve(success)
      );
  });
}

export function acceptScreenshot(screenshotTime, screenshotPath) {
  return (dispatch, getState) => {
    uploadScreenshot(screenshotPath)
      .then(
        () => {
          const { getGlobal } = remote;
          const currentWorklogId = getState().get('tracker').currentWorklogId;
          const appDir = getGlobal('appDir');
          const worklogsDir = `${appDir}/worklogs`;
          const worklogFile = `${worklogsDir}/${currentWorklogId}.worklog`;
          fs.readFile(worklogFile, (err, file) => {
            const worklog = JSON.parse(file);
            const screenshotId = worklog.screenshots
              .findIndex(screenshot => screenshot.name === path.basename(screenshotPath));
            worklog.screenshots[screenshotId].uploaded = true;
            fs.writeFile(worklogFile, JSON.stringify(worklog, null, 4));
            dispatch({
              type: types.ACCEPT_SCREENSHOT,
              screenshotTime,
            });
          });
        }
      );
  };
}
