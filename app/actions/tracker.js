import { remote } from 'electron';
import storage from 'electron-json-storage';
import fs from 'fs';
import path from 'path';
import fetch from 'isomorphic-fetch';
import moment from 'moment';

import * as types from '../constants';
import { success, fail } from '../helpers/promise';
import { staticUrl } from '../config/config';

export function tick() {
  return {
    type: types.TICK,
  };
}

export function dismissIdleTime(time) {
  return {
    type: types.DISMISS_IDLE_TIME,
    payload: time,
  };
}

export function startTimer(description, trackingIssue) {
  return (dispatch, getState) => {
    const { getGlobal } = remote;
    const appDir = getGlobal('appDir');
    const worklogsDir = `${appDir}/worklogs`;
    const worklogId = Date.now();
    const worklogFile = `${worklogsDir}/${worklogId}.worklog`;
    const currentIssueId = trackingIssue || getState().issues.meta.get('selected');
    const currentIssue =
      getState().issues.byId.get(currentIssueId) ||
      getState().issues.recentById.get(currentIssueId);
    const worklog = {
      issueId: currentIssueId,
      id: worklogId,
      started: moment(worklogId).toString(),
      description,
      screenshots: [],
      timeTracked: 0,
      submitted: false,
    };
    fs.writeFile(worklogFile, JSON.stringify(worklog, null, 2), (err) => {
      if (err) throw err;
    });
    dispatch({
      type: types.START,
      worklogId,
      issueId: currentIssueId,
      description,
    });
    dispatch({
      type: types.SET_TRACKING_ISSUE,
      payload: currentIssueId
    });
    dispatch({
      type: types.ADD_RECENT_ISSUE,
      payload: {
        id: currentIssueId,
        issue: currentIssue,
      },
    })
  };
}

export function pauseTimer() {
  return {
    type: types.PAUSE,
  };
}

export function unpauseTimer() {
  return {
    type: types.UNPAUSE,
  };
}

export function stopTimer() {
  return {
    type: types.STOP,
  };
}

export function resetTimer() {
  return {
    type: types.RESET,
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
    const url = `${staticUrl}/desktop-tracker/sign-bucket-url`;
    const options = {
      method: 'POST',
      body: JSON.stringify({ fileName }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(url, options)
      .then(
        res => res.status === 200 && res.json(),
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
        },
      )
      .then(
        () => resolve(success),
      );
  });
}

export function updateWorklog(worklog, params = { sync: false }) {
  return (dispatch, getState) => new Promise((resolve, reject) => {
    dispatch({
      type: types.SET_WORKLOG_UPLOAD_STATE,
      payload: true
    });
    const token = getState().jira.jwt;
    const jiraClient = getState().jira.client;
    const online = getState().jira.online;
    if (online) {
      uploadWorklog({ jiraClient, worklog, token, })
        .then(
          (resWorklog) => {
            dispatch({
              type: types.SET_WORKLOG_UPLOAD_STATE,
              payload: false
            });
            resolve(resWorklog);
          },
          (err) => reject(err)
        );
    } else {
      storage.get('offline_worklogs', (err, oldData) => {
        let newData = oldData;
        const tempId = `${Date.now()}`;
        const started = Date.now() - worklog.time;
        const newLog = {
          ...worklog,
          started,
          tempId,
        }
        if (!Array.isArray(newData)) {
          newData = [];
          newData.push(newLog);
        } else {
          newData.push(newLog);
        }
        storage.set('offline_worklogs', newData)
        reject('No connection')
      });
    }
  });
}

function uploadWorklog(params) {
  return new Promise((resolve) => {
    const { jiraClient, worklog, token } = params;
    const { time, description, issueId } = worklog;
    const jiraWorklog = {
      comment: description,
      timeSpentSeconds: time < 60 ? 60 : time,
    }
    const opts = {
      issueId,
      worklog: jiraWorklog,
    };
    jiraClient.issue.addWorkLog(opts, (e, status, response) => {
      const { id } = response.body;
      const url = `${staticUrl}/desktop-tracker/submit-worklog`;
      const options = {
        method: 'POST',
        body: JSON.stringify({
          id,
          worklog: {
            ...worklog,
            timeTracked: time,
          },
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      fetch(url, options)
        .then(
          (res) => {
            if (res.status === 200) {
              resolve(response.body);
            } else {
              reject(res);
            }
          },
        );
    });
  });
}

export function acceptScreenshot(screenshotTime, screenshotPath) {
  return (dispatch, getState) => {
    uploadScreenshot(screenshotPath)
      .then(
        () => {
          const { getGlobal } = remote;
          const appDir = getGlobal('appDir');
          const currentWorklogId = getState().tracker.currentWorklogId;
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
              screenshotName: path.basename(screenshotPath),
            })
          });
        },
      );
  };
}
