// @flow
import client from './client';

export function fetchProjects(): Promise<*> {
  return client.getAllProjects();
}

export function fetchProjectStatuses(projectIdOrKey: number | string): Promise<*> {
  return client.getProjectStatuses({ projectIdOrKey });
}
