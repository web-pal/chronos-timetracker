import React from 'react';
import { ThemeProvider } from 'styled-components';

import Flex from '../components/Base/Flex/Flex';
import Menu from './Menu/Menu';
import Header from '../components/Base/Header/Header';

import IssueView from '../markup/containers/IssueView/IssueView';

// TODO: allow user to customize theme
const theme = { primary: '#0052CC' };

const Main = () =>
  <ThemeProvider theme={theme}>
    <Flex column style={{ height: '100%', width: '100%' }}>
      <Header />
      <Flex row>
        <Menu />
        <IssueView style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.18)' }} />
      </Flex>
    </Flex>
  </ThemeProvider>;

export default Main;
