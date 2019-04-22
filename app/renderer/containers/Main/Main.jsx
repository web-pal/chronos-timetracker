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
  SaveWorklogInetIssueModal,
  SettingsModal,
  WorklogModal,
  ConfirmDeleteWorklogModal,
} from '../Modals';
import Header from '../Header';
import Sidebar from '../Sidebar';
import IssueView from '../IssueView';
import * as S from './styled';


const theme = {
  primary: '#0052CC',
};

type Props = {};

const Main: StatelessFunctionalComponent<Props> = (): Node => (
  <ThemeProvider theme={theme}>
    <S.Main>
      <S.Left>
        <Header />
        <Sidebar />
      </S.Left>
      <IssueView />

      <AlertModal />
      <SaveWorklogInetIssueModal />
      <SettingsModal />
      <WorklogModal />
      <ConfirmDeleteWorklogModal />
    </S.Main>
  </ThemeProvider>
);

export default Main;
