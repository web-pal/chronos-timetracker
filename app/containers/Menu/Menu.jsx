import React from 'react';

import Flex from '../../components/Base/Flex/Flex';
import MenuHeader from './MenuHeader';
import Sidebar from './Sidebar';

const Menu = () =>
  <Flex column className="Menu">
    <MenuHeader />
    <Sidebar />
  </Flex>;

export default Menu;
