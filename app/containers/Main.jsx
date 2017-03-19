import React from 'react';

import Flex from '../components/Base/Flex/Flex';
import Tracker from './Tracker';
import Menu from './Menu';


const Main = () =>
  <Flex row className="occupy-height">
    <Menu />
    <Tracker />
  </Flex>;

export default Main;
