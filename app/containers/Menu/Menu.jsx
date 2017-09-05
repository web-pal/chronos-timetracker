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
  <Flex column style={{ minWidth: 400 }}>
    <Tabs />
    <SearchBar />
    <IssuesList />
  </Flex>
);
const IssueView = (props) => (
  <Issue {...props} />
);
/* eslint-enable */

const Menu = () => (
  <Flex column spaceBetween style={{ height: '100%', width: '100%' }}>
    <Flex column>
      <Header />
      {window.innerWidth < 1000 ?
        <IssuesListView /> :
        <Flex row>
          <IssuesListView />
          <IssueView style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.18)' }} />
        </Flex>
      }
    </Flex>
    {/*
    <Footer />
    */}
  </Flex>
);
export default Menu;
