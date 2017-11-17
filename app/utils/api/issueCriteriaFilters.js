// @flow
import jira from '../jiraClient';

export function fetchIssueTypes(): Promise<*> {
  return jira.client.issueType.getAllIssueTypes();
}

export function fetchIssueStatuses(): Promise<*> {
  return jira.client.status.getAllStatuses();
}
