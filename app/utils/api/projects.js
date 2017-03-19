import jira from '../jiraClient';


export function fetchProjects() { // eslint-disable-line
  return jira.client.project.getAllProjects();
}
