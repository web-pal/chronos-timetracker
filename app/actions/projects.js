import * as types from '../constants';


export function fetchProjects(selectLastSelectedProject = false) {
  return {
    type: types.FETCH_PROJECTS_REQUEST,
    selectLastSelectedProject,
  };
}


export function selectProject(projectId, type) {
  return {
    type: types.SELECT_PROJECT,
    payload: projectId,
    meta: type,
  };
}
