import jira from '../jiraClient';

export function fetchFilters(): Promise<*> {
  return jira.client.filter.getFavoriteFilters(); // TYPO in docs (getFavoUriteFilters)
}

export function createFilter(filter): Promise<*> {
  return jira.client.filter.createFilter({ filter });
}
