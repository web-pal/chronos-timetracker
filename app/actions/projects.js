import * as types from '../constants/';
import storage from 'electron-json-storage';
import { normalize } from 'normalizr';

import { projectSchema } from '../schemas/';

export function fetchProjects(selectLastSelectedProject = false) {
  return {
    type: types.FETCH_PROJECTS_REQUEST,
    selectLastSelectedProject,
  };
}

export const selectProject = projectId => (dispatch, getState) => {
  const host = getState().profile.host;
  storage.get('lastProject', (e, data) => {
    storage.set('lastProject', { ...data, [host]: projectId });
    dispatch({
      type: types.SELECT_PROJECT,
      payload: projectId,
    });
  });
};

export const getLastProject = () => (dispatch, getState) =>
  new Promise(resolve => storage.get('lastProject', (e, data) => {
    const host = getState().jira.credentials.get('host');
    if (data[host]) {
      dispatch(selectProject(data[host]));
      resolve(data[host]);
    }
  }));

export const fetchProjectStatuses = projectIdOrKey => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const jiraClient = getState().jira.client;
    if (!jiraClient) return;
    jiraClient.project.getStatuses({ projectIdOrKey }, (err, response) => {
      if (err) reject(err);
      console.log('Project statuses', response);
      resolve(response);
    });
  });
