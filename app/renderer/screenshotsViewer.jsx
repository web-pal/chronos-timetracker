// @flow
import React from 'react';
import {
  render,
} from 'react-dom';
import {
  Provider,
} from 'react-redux';
import * as Sentry from '@sentry/electron';

import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
} from 'redux';
import {
  windowsManager,
} from 'shared/reducers';
import {
  actionTypes,
} from 'actions';
import './assets/stylesheets/main.less';

import rendererEnhancer from './store/middleware';

import ScreenshotsViewerPopup from './containers/Popups/ScreenshotsViewerPopup';
import pjson from '../package.json';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    enableNative: false,
    release: `${pjson.version}_${process.platform}`,
  });
}

const initialState = {
  isLoading: true,
  screenshotsPeriod: 600,
  issuesWithScreenshotsActivity: [],
  currentIssue: null,
  currentScreenshots: [],
};

const screenshotsViewerReducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case actionTypes.ADD_SCREENSHOT:
      return {
        ...state,
        currentScreenshots: [
          ...state.currentScreenshots,
          action.payload,
        ],
      };
    case actionTypes.SET_SCREENSHOTS:
      return {
        ...state,
        currentScreenshots: action.payload,
      };
    case actionTypes.DELETE_SCREENSHOT:
      return {
        ...state,
        issuesWithScreenshotsActivity: (
          state.issuesWithScreenshotsActivity.map(
            a => ({
              ...a,
              worklogs: (
                a.worklogs.map(
                  w => ({
                    ...w,
                    screenshots: w.screenshots.map(
                      s => ({
                        ...s,
                        status: (
                          action.issueId === a.issue.id
                          && action.worklogId === w.id
                          && action.timestamp === s.timestamp
                        ) ? 'deleted'
                          : s.status,
                      }),
                    ),
                  }),
                )
              ),
            }),
          )
        ),
      };
    case actionTypes.SET_SCREENSHOTS_VIEWER_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  windowsManager,
  screenshotsViewerReducer,
});

const store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(rendererEnhancer),
  ),
);

render(
  <Provider store={store}>
    <ScreenshotsViewerPopup />
  </Provider>,
  document.getElementById('root'),
);
