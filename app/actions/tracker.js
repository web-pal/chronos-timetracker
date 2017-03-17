import { remote } from 'electron';
import storage from 'electron-json-storage';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { staticUrl } from 'config';

import * as types from '../constants';
import { success, fail } from '../helpers/promise';

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

export function startTimer(trackingIssue) {
  return (dispatch, getState) => {
    // Temporary worklog ID
    const worklogId = Date.now();
    const currentIssueId = trackingIssue || getState().issues.meta.selected;
    const currentIssue =
      getState().issues.byId.get(currentIssueId) ||
      getState().issues.recentById.get(currentIssueId);
    dispatch({
      type: types.START,
      worklogId,
      issueId: currentIssueId,
    });
    dispatch({
      type: types.SET_TRACKING_ISSUE,
      payload: currentIssueId,
    });
    dispatch({
      type: types.ADD_RECENT_ISSUE,
      payload: {
        id: currentIssueId,
        issue: currentIssue,
      },
    });
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
                'Content-Type': 'image/png',
              },
              body: image,
            };
            fetch(signedUrl, opts).then((res) => {
              if (res.status === 200) {
                resolve(success);
              }
            });
          });
        },
      );
  });
}


function uploadWorklog(params) {
  return new Promise((resolve, reject) => {
    const { jiraClient, worklog, token, activity } = params;
    if (!jiraClient) return;
    const { time, description, issueId } = worklog;
    const jiraWorklog = {
      comment: description,
      timeSpentSeconds: time < 60 ? 60 : time,
    };
    const opts = {
      issueId,
      worklog: jiraWorklog,
    };
    jiraClient.issue.addWorkLog(opts, (e, status, response) => {
      const { id } = response.body;
      const url = `${staticUrl}/api/tracker/worklog`;
      const options = {
        method: 'POST',
        body: JSON.stringify({
          id,
          worklog: {
            ...worklog,
            timeTracked: time,
            activity,
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
            console.log(res);
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

export function createWorklog(worklog) {
  return (dispatch, getState) => new Promise((resolve, reject) => {
    const jiraClient = getState().jira.client;
    if (!jiraClient) return;
    dispatch({
      type: types.SET_WORKLOG_UPLOAD_STATE,
      payload: true,
    });
    const token = getState().jira.jwt;
    const online = getState().jira.online;
    const activity = getState().tracker.activity.toJS();
    if (online) {
      uploadWorklog({ jiraClient, worklog, token, activity })
        .then(
          (resWorklog) => {
            dispatch({
              type: types.SET_WORKLOG_UPLOAD_STATE,
              payload: false,
            });
            resolve(resWorklog);
          },
          err => reject(err),
        );
    } else {
      storage.get('offline_worklogs', (err, oldData) => {
        let newData = oldData;
        if (!Array.isArray(newData)) {
          newData = [];
        }
        newData.push({ ...worklog, activity });
        storage.set('offline_worklogs', newData);
        reject('No connection');
      });
    }
  });
}

export function checkCurrentOfflineScreenshots() {
  return (dispatch) => {
    storage.get('current_offline_screenshots', (err, screenshots) => {
      console.log(screenshots);
      if (Array.isArray(screenshots) && screenshots.length) {
        // TODO: make it syncronyous(later on refactoring using redux-saga)
        screenshots.forEach((screen) => {
          uploadScreenshot(screen)
            .then(() => {
              dispatch({
                type: types.ACCEPT_SCREENSHOT,
                screenshotName: path.basename(screen),
              });
              fs.stat(screen, (error) => {
                if (error == null) {
                  fs.unlink(screen);
                }
              });
            });
        });
        storage.set('current_offline_screenshots', []);
      }
    });
  };
}


export function checkCurrentOfflineWorklogs() {
  return (dispatch, getState) => {
    const jiraClient = getState().jira.client;
    const token = getState().jira.jwt;
    if (!jiraClient) return;

    storage.get('offline_worklogs', (err, worklogs) => {
      if (Array.isArray(worklogs) && worklogs.length) {
        // TODO: make it syncronyous(later on refactoring using redux-saga)
        worklogs.forEach((item) => {
          const { activity, ...worklog } = item;
          uploadWorklog({ jiraClient, worklog, token, activity });
        });
        storage.set('offline_worklogs', []);
      }
    });
  };
}


export function acceptScreenshot(screenshotTime, screenshotPath) {
  return (dispatch, getState) => {
    dispatch({
      type: types.SAVE_LAST_SCREENSHOT_TIME,
      payload: screenshotTime,
    });
    if (getState().jira.online) {
      uploadScreenshot(screenshotPath)
        .then(
          () => {
            dispatch({
              type: types.ACCEPT_SCREENSHOT,
              screenshotName: path.basename(screenshotPath),
            });
            fs.stat(screenshotPath, (err) => {
              if (err == null) {
                fs.unlink(screenshotPath);
              }
            });
          },
        );
    } else {
      storage.get('current_offline_screenshots', (err, oldData) => {
        let newData = oldData;
        if (!Array.isArray(newData)) {
          newData = [];
        }
        newData.push(screenshotPath);
        storage.set('current_offline_screenshots', newData);
      });
    }
  };
}

export function submitUnfinishedWorklog(worklog) {
  return (dispatch, getState) => new Promise((resolve) => {
    const activity = getState().tracker.activity.toJS();
    const time = getState().tracker.time;
    const url = `${staticUrl}/api/tracker/worklog`;
    const token = getState().jira.jwt;
    const options = {
      method: 'POST',
      body: JSON.stringify({
        tempId: Date.now(),
        worklog: {
          ...worklog,
          timeTracked: time,
          activity,
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
            console.log(res);
          } else {
            console.log(res);
          }
        },
      );
  });
}

export function addActivityPercent(percent) {
  return {
    type: types.ADD_ACTIVITY_PERCENT,
    payload: percent,
  };
}

export function setDescription(description) {
  return {
    type: types.SET_DESCRIPTION,
    payload: description
  }
}
