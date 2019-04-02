// @flow
import {
  createSelector,
} from 'reselect';

import type {
  Id,
  UiState,
  IssueType,
  IssueStatus,
} from '../types';

import {
  getResourceMappedList,
} from './resources';
import {
  getSelfKey,
} from './profile';


export const getUiState = (keyOrKeys: string | Array<string>) => (
  ({ ui }: { ui: UiState }) => (
    Array.isArray(keyOrKeys)
      ? (
        keyOrKeys.reduce(
          (acc, key) => ({
            ...acc,
            [key]: ui[key],
          }),
          {},
        )
      )
      : ui[keyOrKeys]
  )
);

export const getModalState = (key: string) => ({ ui }: { ui: UiState }) => ui.modalState[key];

export const getFilterOptions = createSelector(
  [
    getResourceMappedList('issuesTypes', 'issuesTypes'),
    getResourceMappedList('issuesStatuses', 'issuesStatuses'),
    getSelfKey,
  ],
  (
    issuesTypes: Array<IssueType>,
    issuesStatuses: Array<IssueStatus>,
    selfKey: Id | null,
  ) => [{
    name: 'Type',
    key: 'type',
    options: issuesTypes,
    showIcons: true,
  }, {
    name: 'Status',
    key: 'status',
    options: issuesStatuses,
    showIcons: true,
  }, {
    name: 'Assignee',
    key: 'assignee',
    options: [
      {
        name: 'Current User',
        id: selfKey,
      },
      {
        name: 'Unassigned',
        id: 'unassigned',
      },
    ],
    showIcons: false,
  }],
);

export const getBaseUrl = createSelector(
  [
    getUiState('protocol'),
    getUiState('hostname'),
    getUiState('port'),
    getUiState('pathname'),
  ],
  (
    protocol: string,
    hostname: string,
    port: number | string,
    pathname: string,
  ) => {
    const p = port ? `:${port}` : '';
    return `${protocol}://${hostname}${p}${pathname.replace(/\/$/, '')}`;
  },
);
