import React from 'react';

import Flex from '../../components/Base/Flex/Flex';
// import MenuHeader from './MenuHeader';
// import Sidebar from './Sidebar';

import Header from '../../components/Base/Header/Header';
import Footer from '../../components/Base/Footer/Footer';

import Tabs from '../../markup/IssuesView/Tabs/Tabs';
import SearchBar from '../../markup/IssuesView/SearchBar/SearchBar';
import IssuesList from '../../markup/IssuesView/IssuesList/IssuesList';
import Filter from '../../markup/IssuesView/Filter/Filter';

const showFilters = true;

const Menu = () =>
  <Flex
    column
    spaceBetween
    style={{
      height: '100%',
      width: '50%',
      minWidth: 500,
    }}
  >
    <Flex column>
      <Header />
      {showFilters ?
        <Filter /> :
        <Flex column>
          <Tabs />
          <SearchBar />
          <IssuesList />
        </Flex>
      }
      {/*
      <Sidebar />
      */}
    </Flex>
    <Footer />
  </Flex>;

export default Menu;
