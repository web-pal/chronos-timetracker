import React from 'react';

import Flex from '../components/Base/Flex/Flex';
import HeaderWrapper from './HeaderWrapper';
import SidebarWrapper from './SidebarWrapper';

const Menu = () =>
  <Flex column className="Menu">
    <HeaderWrapper />
    <SidebarWrapper />
  </Flex>;

export default Menu;
