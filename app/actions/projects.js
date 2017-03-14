import * as types from '../constants/';
import storage from 'electron-json-storage';
import { normalize } from 'normalizr';

import { projectSchema } from '../schemas/';

function setProjectsFetchState(value) {
  return {
    type: types.SET_PROJECTS_FETCH_STATE,
    payload: value,
  };
}

export const fetchProjects =
  () => (dispatch, getState) => new Promise((resolve, reject) => {
    const jiraClient = getState().jira.client;
    if (!jiraClient) return;
    dispatch(setProjectsFetchState(true));
    const fetchRepedioulsy = setInterval(() => {
      jiraClient.project.getAllProjects({}, (error, response) => {
        if (error) {
          dispatch({
            type: types.THROW_ERROR,
            error,
          });
          reject(error);
          return;
        }
        const normalizedData = normalize(response, [projectSchema]);
        dispatch({
          type: types.FILL_PROJECTS,
          payload: {
            map: normalizedData.entities.projects,
            ids: normalizedData.result,
          },
        });
        dispatch(setProjectsFetchState(false));
        clearInterval(fetchRepedioulsy);
        resolve('done');
      });
    }, 1000);
  });

export const selectProject = projectId => (dispatch, getState) => {
  const host = getState().jira.credentials.get('host');
  storage.get('lastProject', (e, data) => {
    data[host] = projectId;
    storage.set('lastProject', data);
    dispatch({
      type: types.SELECT_PROJECT,
      payload: projectId,
    });
  })
};

export const getLastProject = () => (dispatch, getState) =>
  new Promise((resolve, reject) => storage.get('lastProject', (e, data) => {
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

// export const fetchProjectAvatars = () => (dispatch, getState) =>
  // new Promise((resolve, reject) => {
    // const jiraClient = getState().jira.client;
    // jiraClient.proje
  // })
