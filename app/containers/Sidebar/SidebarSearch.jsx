// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { issuesActions, uiActions } from 'actions';
import { getSidebarFiltersOpen, getIssuesSearchValue } from 'selectors';

import {
  SearchBar,
  SearchIcon,
  SearchInput,
  SearchOptions,
  RefreshIcon,
  FilterIcon,
} from './styled';

import type {
  SetSidebarFiltersOpen,
  SetIssuesSearchValue,
  ClearIssues,
  FetchIssuesRequest,
} from '../../types';

type Props = {
  searchValue: string,
  isSidebarFiltersOpen: boolean,
  setSidebarFiltersOpen: SetSidebarFiltersOpen,
  setIssuesSearchValue: SetIssuesSearchValue,
  clearIssues: ClearIssues,
  fetchIssuesRequest: FetchIssuesRequest,
}

const SidebarSearch: StatelessFunctionalComponent<Props> = ({
  searchValue,
  isSidebarFiltersOpen,
  setSidebarFiltersOpen,
  setIssuesSearchValue,
  clearIssues,
  fetchIssuesRequest,
}: Props): Node =>
  <SearchBar>
    <SearchIcon
      label="Search"
      size="medium"
    />
    <SearchInput
      placeholder="Search issue"
      type="text"
      value={searchValue}
      onChange={(ev) => {
        setIssuesSearchValue(ev.target.value);
      }}
    />
    <SearchOptions>
      <RefreshIcon
        label="Refresh"
        size="medium"
        onClick={() => {
          clearIssues();
          fetchIssuesRequest();
        }}
      />
      <FilterIcon
        label="Filter"
        size="medium"
        primaryColor={isSidebarFiltersOpen ? '#0052CC' : '#333333'}
        onClick={() => setSidebarFiltersOpen(!isSidebarFiltersOpen)}
      />
    </SearchOptions>
  </SearchBar>;

function mapStateToProps(state) {
  return {
    searchValue: getIssuesSearchValue(state),
    isSidebarFiltersOpen: getSidebarFiltersOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...uiActions, ...issuesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarSearch);
