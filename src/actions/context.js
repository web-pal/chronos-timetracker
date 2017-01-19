import fetch from 'isomorphic-fetch';

import * as types from '../constants';
import { staticUrl } from '../config/config';

export function fetchProjects() {
  return (dispatch, getState) => new Promise((resolve, reject) => {
    dispatch({
      type: types.START_FETCH,
      value: 'projects',
    });
    const jiraClient = getState().jira.client;
    const fetchRepedioulsy = setInterval(() => {
      jiraClient.project.getAllProjects({}, (error, response) => {
        if (error) {
          dispatch({
            type: types.THROW_ERROR,
            error,
          });
          reject(error);
        }
        dispatch({
          type: types.GET_PROJECTS,
          projects: response,
        });
        dispatch({
          type: types.FINISH_FETCH,
        });
        clearInterval(fetchRepedioulsy);
        resolve('done');
      });
    }, 1000);
  });
}

export function fetchSettings() {
  return (dispatch, getState) => new Promise((resolve) => {
    const token = getState().jira.jwt;
    const url = `${staticUrl}/api/tracker/settings/desktopApp`;
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(url, options)
      .then(
        res => res.status === 200 && res.json(),
      )
      .then(
        (json) => {
          dispatch({
            type: types.GET_SETTINGS,
            settings: json.payload,
          });
          resolve();
        },
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

export function changeFilter(value) {
  return {
    type: types.CHANGE_FILTER,
    value,
  };
}

export function clearFilter() {
  return {
    type: types.CLEAR_FILTER,
  };
}

export function toggleResolveFilter() {
  return {
    type: types.TOGGLE_RESOLVE_FILTER,
  };
}
