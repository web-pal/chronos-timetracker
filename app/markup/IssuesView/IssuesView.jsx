import React from 'react';
import { ThemeProvider } from 'styled-components';

import Flex from '../../components/Base/Flex/Flex';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

import Tabs from './Tabs/Tabs';
import SearchBar from './SearchBar/SearchBar';
import IssuesList from './IssuesList/IssuesList';

const theme = {
  primary: '#0052CC',
};

export default () => (
  <ThemeProvider theme={theme}>
    <Flex column spaceBetween style={{ height: '100%' }}>
      <Flex column>
        <Header />
        <Tabs />
        <SearchBar />
        <IssuesList />
      </Flex>
      <Footer />
    </Flex>
  </ThemeProvider>
);
