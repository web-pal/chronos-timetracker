import React from 'react';

import Flex from '../components/Base/Flex/Flex';
import Tracker from './Tracker/Tracker';
import Menu from './Menu/Menu';


const Main = () =>
  <Flex row className="occupy-height">
    <Menu />
    <Tracker />
  </Flex>;

export default Main;
