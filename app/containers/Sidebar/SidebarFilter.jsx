// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { issuesActions, uiActions } from 'actions';
import { getSidebarType, getSidebarFiltersOpen } from 'selectors';

import {
  SearchBar,
  SearchIcon,
  SearchInput,
  SearchOptions,
  RefreshIcon,
  FilterIcon,
} from './styled';

import type { SetSidebarFiltersOpen } from '../../types';

type Props = {
  searchValue: string,
  isSidebarFiltersOpen: boolean,
  setSidebarFiltersOpen: SetSidebarFiltersOpen,
}

const SidebarFilter: StatelessFunctionalComponent<Props> = ({
  searchValue,
  isSidebarFiltersOpen,
  setSidebarFiltersOpen,
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
        console.log(ev.target.value)
      }}
    />
    <SearchOptions>
      <RefreshIcon
        label="Refresh"
        size="medium"
        onClick={() => {
          console.log('refresh');
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
    searchValue: '',
    isSidebarFiltersOpen: getSidebarFiltersOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarFilter);
