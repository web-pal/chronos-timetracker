import React from 'react';
import styled from 'styled-components2';

import Sidebar from './Sidebar';

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 85px);
  min-width: 420px;
  max-width: 420px;
  z-index: 21;
`;

const Menu = () =>
  <MenuContainer>
    <Sidebar />
  </MenuContainer>;

export default Menu;
