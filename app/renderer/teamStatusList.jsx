// @flow
import React from 'react';
import {
  render,
} from 'react-dom';

import {
  Provider,
} from 'react-redux';

import './assets/stylesheets/teamStatusList.less';

import store from './store';
import TeamStatusList from './containers/Popups/TeamStatusList';

render(
  <Provider store={store}>
    <TeamStatusList />
  </Provider>,
  document.getElementById('root'),
);
