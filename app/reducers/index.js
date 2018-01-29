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
import worklogs from './worklogs';

import indexedListPlugin from './resourcesPlugins/indexedListPlugin';
import clearListPlugin from './resourcesPlugins/clearListPlugin';
import metaPlugin from './resourcesPlugins/metaPlugin';


const rootReducer = combineReducers({
  profile,
  ui,
  settings,
  timer,
  worklogs,
  form: formReducer,
  issuesTypes: resourceReducer('issuesTypes', {
    plugins: [includedResources],
    initialState: {
      lists: {
        issuesTypes: [],
      },
    },
  }),
  issuesStatuses: resourceReducer('issuesStatuses', {
    plugins: [includedResources],
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
  issues: resourceReducer('issues', {
    plugins: [indexedListPlugin, clearListPlugin, metaPlugin],
    initialState: {
      meta: {
        refetchFilterIssuesMarker: false,
        filterIssuesTotalCount: 0,
      },
      lists: {
        recentIssues: [],
        filterIssuesIndexed: {},
      },
    },
  }),
});

export default rootReducer;
