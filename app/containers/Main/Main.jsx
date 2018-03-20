// @flow
import React from 'react';
import {
  ThemeProvider,
} from 'styled-components';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  AlertModal,
  SettingsModal,
  WorklogModal,
  ConfirmDeleteWorklogModal,
} from '../Modals';
import Header from '../Header';
import Sidebar from '../Sidebar';
import IssueView from '../IssueView';
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

      <AlertModal />
      <SettingsModal />
      <WorklogModal />
      <ConfirmDeleteWorklogModal />
    </MainContainer>
  </ThemeProvider>;

export default Main;
