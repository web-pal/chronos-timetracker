// @flow
import jira from '../jiraClient';

export function fetchIssueTypes(projectIdOrKey: string): Promise<*> {
  return jira.client.project.getStatuses({ projectIdOrKey });
}

export function fetchIssueStatuses(): Promise<*> {
  return jira.client.status.getAllStatuses();
}
