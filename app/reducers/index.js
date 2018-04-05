// @flow
import {
  combineReducers,
} from 'redux';
import {
  resourceReducer,
} from 'redux-resource';
import {
  includedResources,
} from 'redux-resource-plugins';

import {
  reducer as formReducer,
} from 'redux-form';

import profile from './profile';
import ui from './ui';
import settings from './settings';
import timer from './timer';

import indexedListPlugin from './resourcesPlugins/indexedListPlugin';
import clearListPlugin from './resourcesPlugins/clearListPlugin';
import clearAllPlugin from './resourcesPlugins/clearAllPlugin';
import metaPlugin from './resourcesPlugins/metaPlugin';


const rootReducer = combineReducers({
  profile,
  ui,
  settings,
  timer,
  form: formReducer,
  issuesComments: resourceReducer('issuesComments', {
    plugins: [
      clearAllPlugin,
    ],
  }),
  issuesFields: resourceReducer('issuesFields', {
    plugins: [
      clearAllPlugin,
    ],
    initialState: {
      lists: {
        allFields: [],
      },
    },
  }),
  issuesTypes: resourceReducer('issuesTypes', {
    plugins: [
      clearAllPlugin,
    ],
    initialState: {
      lists: {
        issuesTypes: [],
      },
    },
  }),
  issuesStatuses: resourceReducer('issuesStatuses', {
    plugins: [
      clearAllPlugin,
    ],
    initialState: {
      lists: {
        issuesStatuses: [],
        issueTransitions: [],
      },
    },
  }),
  sprints: resourceReducer('sprints', {
    plugins: [
      clearAllPlugin,
    ],
    initialState: {
      lists: {
        allSprints: [],
      },
    },
  }),
  filters: resourceReducer('filters', {
    plugins: [
      clearAllPlugin,
    ],
    initialState: {
      lists: {
        allFilters: [],
      },
    },
  }),
  boards: resourceReducer('boards', {
    plugins: [
      clearAllPlugin,
    ],
    initialState: {
      lists: {
        allBoards: [],
      },
    },
  }),
  projects: resourceReducer('projects', {
    plugins: [
      clearAllPlugin,
    ],
    initialState: {
      lists: {
        allProjects: [],
      },
    },
  }),
  worklogs: resourceReducer('worklogs', {
    plugins: [
      includedResources,
      clearAllPlugin,
    ],
  }),
  issues: resourceReducer('issues', {
    plugins: [
      includedResources,
      indexedListPlugin,
      clearListPlugin,
      metaPlugin,
      clearAllPlugin,
    ],
    initialState: {
      meta: {
        refetchFilterIssuesMarker: false,
        filterIssuesTotalCount: 10,
      },
      lists: {
        recentIssues: [],
        epicIssues: [],
        filterIssuesIndexed: {},
      },
    },
  }),
});

export default rootReducer;
