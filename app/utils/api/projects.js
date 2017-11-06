import jira from '../jiraClient';


export function fetchProjects() {
  return jira.client.project.getAllProjects();
}
