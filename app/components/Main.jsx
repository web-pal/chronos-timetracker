import React from 'react';

import Flex from './Base/Flex/Flex';
import Menu from '../containers/Menu';
import Tracker from '../containers/Tracker';

const Main = () =>
  <Flex row className="occupy-height">
    <Menu />
    <Tracker />
  </Flex>;

export default Main;
