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
import metaPlugin from './resourcesPlugins/metaPlugin';


const rootReducer = combineReducers({
  profile,
  ui,
  settings,
  timer,
  form: formReducer,
  issuesComments: resourceReducer('issuesComments'),
  issuesFields: resourceReducer('issuesFields', {
    initialState: {
      lists: {
        allFields: [],
      },
    },
  }),
  issuesTypes: resourceReducer('issuesTypes', {
    initialState: {
      lists: {
        issuesTypes: [],
      },
    },
  }),
  issuesStatuses: resourceReducer('issuesStatuses', {
    initialState: {
      lists: {
        issuesStatuses: [],
        issueTransitions: [],
      },
    },
  }),
  sprints: resourceReducer('sprints', {
    initialState: {
      lists: {
        allSprints: [],
      },
    },
  }),
  boards: resourceReducer('boards', {
    initialState: {
      lists: {
        allBoards: [],
      },
    },
  }),
  projects: resourceReducer('projects', {
    initialState: {
      lists: {
        allProjects: [],
      },
    },
  }),
  worklogs: resourceReducer('worklogs', {
    plugins: [includedResources],
  }),
  issues: resourceReducer('issues', {
    plugins: [
      includedResources,
      indexedListPlugin,
      clearListPlugin,
      metaPlugin,
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
