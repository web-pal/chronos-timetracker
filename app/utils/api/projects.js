// @flow
import jira from '../jiraClient';

// eslint-disable-next-line import/prefer-default-export
export function fetchProjects(): Promise<*> {
  return jira.client.project.getAllProjects();
}
