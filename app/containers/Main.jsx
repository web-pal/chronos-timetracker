import React from 'react';
import { ThemeProvider } from 'styled-components';

import Flex from '../components/Base/Flex/Flex';
import Tracker from './Tracker/Tracker';
import Menu from './Menu/Menu';
import SettingsModal from './SettingsModal/SettingsModal';

const theme = {
  primary: '#0052CC',
};

const Main = () =>
  <ThemeProvider theme={theme}>
    <Flex row style={{ height: '100%' }}>
      <Menu />
    </Flex>
  </ThemeProvider>;
{/*
<Tracker />
<SettingsModal />
*/}

export default Main;
