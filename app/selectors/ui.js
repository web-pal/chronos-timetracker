// @flow
import {
  createSelector,
} from 'reselect';

import type {
  UiState,
  AuthFormStep,
  SidebarType,
  TabLabel,
  UpdateInfo,
  IssueFilters,
} from '../types';

import {
  getResourceMappedList,
  getResourceMap,
} from './resources';
import {
  getSelfKey,
} from './profile';


export const getUiState = key => ({ ui }) => ui[key];
export const getModalState = key => ({ ui }) => ui.modalState[key];

export const getAuthFormStep =
  ({ ui }: { ui: UiState }): AuthFormStep => ui.authFormStep;

export const getSidebarType =
  ({ ui }: { ui: UiState }): SidebarType => ui.sidebarType;

export const getIssueViewTab =
  ({ ui }: { ui: UiState }): TabLabel => ui.issueViewTab;

export const getUpdateCheckRunning =
  ({ ui }: { ui: UiState }): boolean => ui.updateCheckRunning;

export const getUpdateAvailable =
  ({ ui }: { ui: UiState }): UpdateInfo | null => ui.updateAvailable;

export const getUpdateFetching =
  ({ ui }: { ui: UiState }): boolean => ui.updateFetching;

export const getSettingsModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.settingsModalOpen;

export const getSupportModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.supportModalOpen;

export const getAboutModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.aboutModalOpen;

export const getAlertModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.alertModalOpen;

export const getConfirmDeleteWorklogModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.confirmDeleteWorklogModalOpen;

export const getWorklogModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.worklogModalOpen;

export const getEditWorklogModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.editWorklogModalOpen;

export const getSidebarFiltersOpen =
  ({ ui }: { ui: UiState }): boolean => ui.sidebarFiltersOpen;

export const getScreenshotsAllowed =
  ({ ui }: { ui: UiState }): boolean => ui.screenshotsAllowed;

export const getIssuesFilters =
  ({ ui }: { ui: UiState }): IssueFilters => ui.issuesFilters;

export const getIssuesSourceOptions = createSelector(
  [
    getResourceMappedList('projects', 'allProjects'),
    getResourceMappedList('boards', 'allBoards'),
  ],
  (projects, boards) => [
    {
      heading: 'Projects',
      items: projects.map(project =>
        ({ value: project.id, content: project.name, meta: { project } })),
    },
    {
      heading: 'Boards',
      items: boards.map(board =>
        ({ value: board.id, content: board.name, meta: { board } })),
    },
  ],
);

export const getIssuesSourceSelectedOption = createSelector(
  [
    getUiState('issuesSourceType'),
    getUiState('issuesSourceId'),
    getResourceMap('projects'),
    getResourceMap('boards'),
  ],
  (
    type,
    id,
    projectsMap,
    boardsMap,
  ) => {
    if (!id) {
      return null;
    }
    switch (type) {
      case 'project': {
        const project = projectsMap[id];
        if (!project) {
          return null;
        }
        return {
          value: project.id,
          content: project.name,
          meta: {
            project,
          },
        };
      }
      case 'kanban':
      case 'scrum': {
        const board = boardsMap[id];
        if (!board) {
          return null;
        }
        return {
          value: board.id,
          content: board.name,
          meta: {
            board,
          },
        };
      }
      default:
        return null;
    }
  },
);

export const getSprintsOptions = createSelector(
  [getResourceMappedList('sprints', 'allSprints')],
  sprints => [{
    heading: 'Sprints',
    items: sprints.map(sprint =>
      ({
        value: sprint.id,
        content: sprint.name,
        meta: {
          sprint,
        },
      })),
  }],
);

export const getSelectedSprintOption = createSelector(
  [
    getUiState('issuesSprintId'),
    getResourceMap('sprints'),
  ],
  (
    sprintId,
    sprintsMap,
  ) => {
    if (!sprintId) {
      return null;
    }
    const sprint = sprintsMap[sprintId];
    if (!sprint) {
      return null;
    }
    return {
      value: sprint.id,
      content: sprint.name,
      meta: {
        sprint,
      },
    };
  },
);

export const getFilterOptions = createSelector(
  [
    getResourceMappedList('issuesTypes', 'issuesTypes'),
    getResourceMappedList('issuesStatuses', 'issuesStatuses'),
    getSelfKey,
  ],
  (
    issuesTypes,
    issuesStatuses,
    selfKey,
  ) =>
    [{
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
