import React from 'react';
import { ThemeProvider } from 'styled-components';

import Flex from '../components/Base/Flex/Flex';
import Menu from './Menu/Menu';
import Header from '../components/Base/Header/Header';

import SettingsModal from '../components/Modals/SettingsModal/SettingsModal';
import SupportModal from '../components/Modals/SupportModal/SupportModal';
import AboutModal from '../components/Modals/AboutModal/AboutModal';

import IssueView from './IssueView/IssueView';

// TODO: allow user to customize theme
const theme = { primary: '#0052CC' };

const Main = () =>
  <ThemeProvider theme={theme}>
    <Flex row>
      <SettingsModal />
      <AboutModal />
      <SupportModal />

      <Flex column>
        <Header />
        <Menu />
      </Flex>

      <IssueView />
    </Flex>
  </ThemeProvider>;

export default Main;
