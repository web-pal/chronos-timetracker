import jira from 'utils/jiraClient';

export function fetchFilters(): Promise<*> {
  return jira.client.filter.getFavoriteFilters(); // TYPO in docs (getFavoUriteFilters)
}

export function createFilter(filter): Promise<*> {
  return jira.client.filter.createFilter({ filter });
}

export function updateFilter(filterId, filter): Promise<*> {
  return jira.client.filter.updateFilter({ filterId, filter });
};
