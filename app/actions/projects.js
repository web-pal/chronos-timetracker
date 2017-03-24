import * as types from '../constants';


export function fetchProjects(selectLastSelectedProject = false) {
  return {
    type: types.FETCH_PROJECTS_REQUEST,
    selectLastSelectedProject,
  };
}


export function selectProject(projectId) {
  return {
    type: types.SELECT_PROJECT,
    payload: projectId,
  };
}
