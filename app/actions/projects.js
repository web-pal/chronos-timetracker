import storage from 'electron-json-storage';
import * as types from '../constants/';


export function fetchProjects(selectLastSelectedProject = false) {
  return {
    type: types.FETCH_PROJECTS_REQUEST,
    selectLastSelectedProject,
  };
}


export const selectProject = projectId => (dispatch, getState) => {
  const host = getState().profile.host;
  dispatch({
    type: types.SELECT_PROJECT,
    payload: projectId,
  });
  storage.get('lastProject', (e, data) => {
    storage.set('lastProject', { ...data, [host]: projectId });
  });
};
