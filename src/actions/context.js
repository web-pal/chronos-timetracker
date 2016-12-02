import fetch from 'isomorphic-fetch';

import * as types from '../constants/context';
import { THROW_ERROR } from '../constants/jira';

export function fetchIssues() {
  return (dispatch, getState) => new Promise((resolve, reject) => {
    const jiraClient = getState().get('jira').client;
    const currentProject = getState().get('context').currentProject;
    const currentProjectKey = currentProject.get('key');
    jiraClient.search.search({
      jql: `project = ${currentProjectKey}`,
    }, (error, response) => {
      if (error) {
        dispatch({
          type: THROW_ERROR,
          error,
        });
        reject(error);
      }
      dispatch({
        type: types.GET_ISSUES,
        issues: response.issues,
      });
      resolve('done');
    });
  });
}

export function fetchProjects() {
  return (dispatch, getState) => new Promise((resolve, reject) => {
    console.log('fetch projectss');
    const jiraClient = getState().get('jira').client;
    const fetchRepedioulsy = setInterval(() => {
      jiraClient.project.getAllProjects({}, (error, response) => {
        if (error) {
          dispatch({
            type: THROW_ERROR,
            error,
          });
          reject(error);
        }
        dispatch({
          type: types.GET_PROJECTS,
          projects: response,
        });
        clearInterval(fetchRepedioulsy);
        resolve('done');
      });
    }, 5000);
  });
}

export function fetchSettings() {
  return (dispatch, getState) => new Promise((resolve) => {
    const token = getState().get('jira').get('jwt');
    const url = 'http://localhost:5000/api/tracker/settings/desktopApp';
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(url, options)
      .then(
        res => res.status === 200 && res.json()
      )
      .then(
        json => {
          dispatch({
            type: types.GET_SETTINGS,
            settings: json.payload,
          });
          resolve();
        }
      );
  });
}

export function setCurrentProject(projectId) {
  return {
    type: types.SET_CURRENT_PROJECT,
    projectId,
  };
}

export function setCurrentIssue(issueId) {
  return {
    type: types.SET_CURRENT_ISSUE,
    issueId,
  };
}
