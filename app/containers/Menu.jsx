import React from 'react';

import Flex from '../components/Base/Flex/Flex';
import Header from './Header';
import SidebarWrapper from './SidebarWrapper';

const Menu = () =>
  <Flex column className="Menu">
    <Header />
    <SidebarWrapper />
  </Flex>;

export default Menu;
