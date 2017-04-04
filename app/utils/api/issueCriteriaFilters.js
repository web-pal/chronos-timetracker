import jira from '../jiraClient';

export function fetchIssueTypes() {
  return jira.client.issueType.getAllIssueTypes();
}

export function fetchIssueStatuses() {
  return jira.client.status.getAllStatuses();
}
