// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { issuesActions, uiActions } from 'actions';
import {
  getSidebarFiltersOpen,
  getIssuesSearchValue,
  getIssuesSearching,
  getFiltersApplied,
} from 'selectors';

import {
  SearchBar,
  SearchIcon,
  SearchInput,
  SearchOptions,
  RefreshIcon,
  FilterIcon,
  FiltersAppliedBadge,
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
  searching: boolean,
  filtersApplied: boolean,
}

const SidebarSearch: StatelessFunctionalComponent<Props> = ({
  searchValue,
  isSidebarFiltersOpen,
  setSidebarFiltersOpen,
  setIssuesSearchValue,
  clearIssues,
  fetchIssuesRequest,
  searching,
  filtersApplied,
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
        isFetching={searching}
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
      {filtersApplied &&
        <FiltersAppliedBadge />
      }
    </SearchOptions>
  </SearchBar>;

function mapStateToProps(state) {
  return {
    searchValue: getIssuesSearchValue(state),
    searching: getIssuesSearching(state),
    isSidebarFiltersOpen: getSidebarFiltersOpen(state),
    filtersApplied: getFiltersApplied(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...uiActions, ...issuesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarSearch);
