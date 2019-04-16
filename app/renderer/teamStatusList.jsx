// @flow
import React from 'react';
import {
  render,
} from 'react-dom';

import './assets/stylesheets/teamStatusList.less';
import TeamStatusList from './containers/Popups/TeamStatusList';

render(
  <TeamStatusList />,
  document.getElementById('root'),
);
