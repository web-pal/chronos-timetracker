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
    const jiraClient = getState().get('jira').client;
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
      resolve('done');
    });
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
