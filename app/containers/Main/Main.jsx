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
import {
  MainContainer,
  LeftContainer,
} from './styled';


const theme = {
  primary: '#0052CC',
};

type Props = {};

const Main: StatelessFunctionalComponent<Props> = (): Node =>
  <ThemeProvider theme={theme}>
    <MainContainer>
      <LeftContainer>
        <Header />
        <Sidebar />
      </LeftContainer>
      <IssueView />

      <FlagsContainer />
      <AlertModal />
      <SettingsModal />
      <WorklogModal />
      <EditWorklogModal />
      <ConfirmDeleteWorklogModal />
    </MainContainer>
  </ThemeProvider>;

export default Main;
