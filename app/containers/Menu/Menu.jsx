import React from 'react';

import Flex from '../../components/Base/Flex/Flex';
// import MenuHeader from './MenuHeader';
// import Sidebar from './Sidebar';

import Header from '../../components/Base/Header/Header';
import Footer from '../../components/Base/Footer/Footer';

import Tabs from '../../markup/containers/IssuesView/Tabs/Tabs';
import SearchBar from '../../markup/containers/IssuesView/SearchBar/SearchBar';
import IssuesList from '../../markup/containers/IssuesView/IssuesList/IssuesList';

import Filter from '../../markup/containers/IssuesView/Filter/Filter';

import Issue from '../../markup/containers/IssueView/IssueView';

// IssuesListFilterView
// IssuesListView
// IssueView

/* eslint-disable */
const IssuesListFilterView = () => <Filter />;
const IssuesListView = () => (
  <Flex column>
    <Tabs />
    <SearchBar />
    <IssuesList />
  </Flex>
);
const IssueView = () => (
  <Issue />
);
/* eslint-enable */

const Menu = () =>
  <Flex
    column
    spaceBetween
    style={{ height: '100%', width: '50%', minWidth: 500 }}
  >
    <Flex column>
      <Header />
      <IssueView />
    </Flex>
    <Footer />
  </Flex>;

export default Menu;
