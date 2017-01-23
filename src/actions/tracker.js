import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import fetch from 'isomorphic-fetch';
import moment from 'moment';
import storage from 'electron-json-storage';

import * as types from '../constants';
import { success, fail } from '../helpers/promise';
import { staticUrl } from '../config/config';

export function tick() {
  return {
    type: types.TICK,
  };
}

export function startTimer(description) {
  return (dispatch, getState) => {
    const { getGlobal } = remote;
    const appDir = getGlobal('appDir');
    const worklogsDir = `${appDir}/worklogs`;
    const worklogId = Date.now();
    const worklogFile = `${worklogsDir}/${worklogId}.worklog`;
    const currentIssueId = getState().issues.meta.get('selected');
    const currentIssue = getState().issues.byId.get(currentIssueId).toJS();
    const worklog = {
      issue: currentIssue,
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
      issueId: currentIssue.id,
      description,
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

export function updateWorklog() {
  return (dispatch, getState) => new Promise((resolve) => {
    const { time, description, trackingIssue, jiraWorklogId } = getState().tracker;
    const token = getState().jira.jwt;
    const jiraClient = getState().jira.client;
    if (jiraWorklogId === null) {
      const url = `${staticUrl}/desktop-tracker/submit-worklog`;
      const opts = {
        issueId: trackingIssue,
        worklog: {
          comment: description,
          timeSpentSeconds: time < 60 ? 60 : time,
        },
      };
      jiraClient.issue.addWorkLog(opts, (e, status, response) => {
        const { id } = response.body;
        const options = {
          method: 'POST',
          body: JSON.stringify({
            worklog: {
              issueId: trackingIssue,
              description,
              timeTracked: time < 60 ? 60 : time,
            },
            id,
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
                dispatch({
                  type: types.SET_JIRA_WORKLOG_ID,
                  id,
                });
                resolve();
              }
            },
          );
      });
    } else {
      const url = `${staticUrl}/desktop-tracker/update-worklog`;
      const opts = {
        worklogId: getState().tracker.jiraWorklogId,
        issueId: trackingIssue,
        worklog: {
          comment: description,
          timeSpentSeconds: time < 60 ? 60 : time,
        },
      };
      jiraClient.issue.updateWorkLog(opts, (e, status, response) => {
        const { id } = response.body;
        const options = {
          method: 'POST',
          body: JSON.stringify({
            worklog: {
              timeTracked: time < 60 ? 60 : time,
            },
            id,
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
                resolve();
              }
            },
          );
      });
    }
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
          const lastScreenshotTime = getState().tracker.lastScreenshotTime;
          const worklogsDir = `${appDir}/worklogs`;
          const worklogFile = `${worklogsDir}/${currentWorklogId}.worklog`;
          fs.readFile(worklogFile, (err, file) => {
            const worklog = JSON.parse(file);
            const screenshotId = worklog.screenshots
              .findIndex(screenshot => screenshot.name === path.basename(screenshotPath));
            worklog.screenshots[screenshotId].uploaded = true;
            fs.writeFile(worklogFile, JSON.stringify(worklog, null, 4));
            const trackingIssue = getState().tracker.trackingIssue;
            const description = getState().tracker.description;
            const token = getState().jira.jwt;
            const jiraClient = getState().jira.client;
            if (lastScreenshotTime === null) {
              const url = `${staticUrl}/desktop-tracker/submit-worklog`;
              const opts = {
                issueId: trackingIssue,
                worklog: {
                  comment: description,
                  timeSpentSeconds: lastScreenshotTime < 60 ? 60 : lastScreenshotTime,
                },
              };
              jiraClient.issue.addWorkLog(opts, (e, status, response) => {
                const { id } = response.body;
                const options = {
                  method: 'POST',
                  body: JSON.stringify({
                    worklog: {
                      issueId: trackingIssue,
                      description,
                      screenshots: worklog.screenshots,
                      timeTracked: lastScreenshotTime < 60 ? 60 : lastScreenshotTime,
                    },
                    id,
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
                        dispatch({
                          type: types.ACCEPT_SCREENSHOT,
                          screenshotTime,
                        });
                        dispatch({
                          type: types.SET_JIRA_WORKLOG_ID,
                          id,
                        });
                      }
                    },
                  );
              });
            } else {
              const url = `${staticUrl}/desktop-tracker/update-worklog`;
              const opts = {
                worklogId: getState().tracker.jiraWorklogId,
                issueId: trackingIssue,
                worklog: {
                  comment: description,
                  timeSpentSeconds: lastScreenshotTime < 60 ? 60 : lastScreenshotTime,
                },
              };
              jiraClient.issue.updateWorkLog(opts, (e, status, response) => {
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
                        dispatch({
                          type: types.ACCEPT_SCREENSHOT,
                          screenshotTime,
                        });
                      }
                    },
                  );
              });
            }
          });
        },
      );
  };
}
