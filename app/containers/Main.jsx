import React from 'react';

import Flex from '../components/Base/Flex/Flex';
import Tracker from './Tracker/Tracker';
import Menu from './Menu/Menu';
import Settings from './Settings/Settings';


const Main = () =>
  <Flex row className="occupy-height">
    <Menu />
    <Tracker />
    <Settings />
  </Flex>;

export default Main;
