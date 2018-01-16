// @flow
import React from 'react';
import {
  ThemeProvider,
} from 'styled-components2';
import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import {
  Flex,
} from 'components';

import {
  AlertModal,
  SettingsModal,
  WorklogModal,
  EditWorklogModal,
  ConfirmDeleteWorklogModal,
} from '../Modals';
import Header from '../Header';
import Sidebar from '../Sidebar';
import IssueView from '../IssueView';
import FlagsContainer from '../FlagsContainer';


const theme = { primary: '#0052CC' };

type Props = {};

const Main: StatelessFunctionalComponent<Props> = (): Node =>
  <ThemeProvider theme={theme}>
    <Flex row style={{ height: '100%' }}>
      <FlagsContainer />

      <AlertModal />
      <SettingsModal />
      <WorklogModal />
      <EditWorklogModal />
      <ConfirmDeleteWorklogModal />
      <Flex column style={{ flex: '0 0 435px' }}>
        <Header />
        <Sidebar />
      </Flex>
      <IssueView />
    </Flex>
  </ThemeProvider>;

export default Main;
