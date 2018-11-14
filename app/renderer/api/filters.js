// @flow
import client from './client';

export function fetchFilters(): Promise<*> {
  return client.getFavoriteFilters();
}

export function createFilter(body): Promise<*> {
  return client.createFilter({ body });
}

export function updateFilter(filterId, body): Promise<*> {
  return client.updateFilter({ filterId, body });
}
