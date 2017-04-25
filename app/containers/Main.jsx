import React from 'react';

import Flex from '../components/Base/Flex/Flex';
import Tracker from './Tracker/Tracker';
import Menu from './Menu/Menu';
import Modals from './Modals/Modals';


const Main = () =>
  <Flex row className="occupy-height">
    <Menu />
    <Tracker />
    <Modals />
  </Flex>;

export default Main;
