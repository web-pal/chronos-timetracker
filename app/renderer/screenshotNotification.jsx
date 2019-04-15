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

import ScreenshotNotificationPopup from './containers/Popups/ScreenshotNotificationPopup';
import pjson from '../package.json';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    enableNative: false,
    release: `${pjson.version}_${process.platform}`,
  });
}

const initialState = {
  screenshot: null,
  decisionTime: null,
  isTest: false,
};

const screenshotNotificationReducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case actionTypes.SET_NOTIFICATION_SCREENSHOT:
      return {
        ...state,
        screenshot: action.screenshot,
        decisionTime: action.decisionTime,
        isTest: action.isTest,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  windowsManager,
  screenshotNotificationReducer,
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
    <ScreenshotNotificationPopup />
  </Provider>,
  document.getElementById('root'),
);
