// @flow
import React from 'react';
import {
  render,
} from 'react-dom';
import {
  Provider,
} from 'react-redux';
import {
  remote,
} from 'electron';
import {
  actionTypes,
} from 'actions';

import * as Sentry from '@sentry/electron';

import IdlePopup from './containers/Popups/IdlePopup';
import configureStore from './store/configurePreloadStore';
import pjson from '../package.json';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    enableNative: false,
    release: `${pjson.version}_${process.platform}`,
  });
}

const system = remote.require('desktop-idle');
const idleTime = system.getIdleTime();

const initialState = {
  time: idleTime,
};

function timer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case actionTypes.TICK:
      return {
        ...state,
        time: state.time + action.payload,
      };
    case actionTypes.__CLEAR_ALL_REDUCERS__:
      return initialState;
    default:
      return state;
  }
}

export const store = configureStore(
  {},
  {
    timer,
  },
);

render(
  <Provider store={store}>
    <IdlePopup />
  </Provider>,
  document.getElementById('root'),
);
