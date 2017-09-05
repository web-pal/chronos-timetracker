import React from 'react';
import { ThemeProvider } from 'styled-components';

import Flex from '../components/Base/Flex/Flex';
import Menu from './Menu/Menu';

// TODO: allow user to customize theme
const theme = { primary: '#0052CC' };

const Main = () =>
  <ThemeProvider theme={theme}>
    <Flex row style={{ height: '100%' }}>
      <Menu />
    </Flex>
  </ThemeProvider>;

export default Main;
