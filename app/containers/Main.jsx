import React from 'react';
import { ThemeProvider } from 'styled-components';

import Flex from '../components/Base/Flex/Flex';
import Menu from './Menu/Menu';
import Header from '../components/Base/Header/Header';

import IssueView from './IssueView/IssueView';

// TODO: allow user to customize theme
const theme = { primary: '#0052CC' };

const Main = () =>
  <ThemeProvider theme={theme}>
    <Flex row>
      <Flex column>
        <Header />
        <Menu />
      </Flex>
      <IssueView />
    </Flex>
  </ThemeProvider>;

export default Main;
