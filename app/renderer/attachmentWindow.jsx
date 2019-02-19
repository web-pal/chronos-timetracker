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

import rendererEnhancer from './store/middleware';

import AttachmentPopup from './containers/Popups/AttachmentPopup';
import pjson from '../package.json';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    enableNative: false,
    release: `${pjson.version}_${process.platform}`,
  });
}

const initialState = {
  attachments: [],
  activeIndex: null,
};

const attachmentReducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case actionTypes.SET_ATTACHMENTS:
      return {
        ...state,
        attachments: action.attachments,
        activeIndex: action.activeIndex,
      };
    case actionTypes.NEXT_ATTACHMENT:
      return {
        ...state,
        activeIndex: state.activeIndex + 1,
      };
    case actionTypes.PREV_ATTACHMENT:
      return {
        ...state,
        activeIndex: state.activeIndex - 1,
      };
    case actionTypes.SELECT_ATTACHMENT:
      return {
        ...state,
        activeIndex: action.payload,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  windowsManager,
  attachmentReducer,
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
    <AttachmentPopup />
  </Provider>,
  document.getElementById('root'),
);
