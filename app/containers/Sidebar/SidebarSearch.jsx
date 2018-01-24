// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { issuesActions, uiActions } from 'actions';
import {
  getSidebarFiltersOpen,
  getIssuesSearchValue,
  getIssuesFetching,
  getFiltersApplied,
} from 'selectors';

import { refresh } from 'data/svg';

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
  fetching: boolean,
  filtersApplied: boolean,
}

const SidebarSearch: StatelessFunctionalComponent<Props> = ({
  searchValue,
  isSidebarFiltersOpen,
  setSidebarFiltersOpen,
  setIssuesSearchValue,
  clearIssues,
  fetchIssuesRequest,
  fetching,
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
        alt="Refresh"
        src={refresh}
        isFetching={fetching}
        onClick={() => {
          clearIssues();
          fetchIssuesRequest();
        }}
      />
      <span className="pointer">
        <FilterIcon
          label="Filter"
          size="medium"
          primaryColor={isSidebarFiltersOpen ? '#0052CC' : '#333333'}
          onClick={() => setSidebarFiltersOpen(!isSidebarFiltersOpen)}
        />
      </span>
      {filtersApplied &&
        <FiltersAppliedBadge />
      }
    </SearchOptions>
  </SearchBar>;

function mapStateToProps(state) {
  return {
    searchValue: getIssuesSearchValue(state),
    fetching: getIssuesFetching(state),
    isSidebarFiltersOpen: getSidebarFiltersOpen(state),
    filtersApplied: getFiltersApplied(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...uiActions, ...issuesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarSearch);
