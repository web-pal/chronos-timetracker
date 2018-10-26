// @flow
import jira from 'utils/jiraClient';

export function fetchProjects(): Promise<*> {
  return jira.client.project.getAllProjects();
}

export function fetchProjectStatuses(projectIdOrKey: number | string): Promise<*> {
  return jira.client.project.getStatuses({ projectIdOrKey });
}
