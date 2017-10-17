// @flow
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Flex } from 'components';

import type { StatelessFunctionalComponent, Node } from 'react';

import { AlertModal, SettingsModal, SupportModal, AboutModal, WorklogModal } from '../Modals';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import IssueView from '../IssueView/IssueView';
import FlagsContainer from '../FlagsContainer/FlagsContainer';


// TODO: allow user to customize theme
const theme = { primary: '#0052CC' };

type Props = {};

const Main: StatelessFunctionalComponent<Props> = (): Node =>
  <ThemeProvider theme={theme}>
    <Flex row style={{ height: '100%' }}>
      <FlagsContainer />

      <AlertModal />
      <SettingsModal />
      <SupportModal />
      <AboutModal />
      <WorklogModal />
      <Flex column style={{ flex: '0 0 435px' }}>
        <Header />
        <Sidebar />
      </Flex>
      <IssueView />
    </Flex>
  </ThemeProvider>;

export default Main;
