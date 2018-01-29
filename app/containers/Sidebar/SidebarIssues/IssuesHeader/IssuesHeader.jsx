// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  bindActionCreators,
} from 'redux';
import {
  ipcRenderer,
} from 'electron';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  issuesActions,
  uiActions,
} from 'actions';
import {
  getCurrentProjectId,
  getSidebarFiltersOpen,
  getIssuesSearchValue,
  getFiltersApplied,
  getUiState,
} from 'selectors';

import {
  SearchBar,
  SearchIcon,
  SearchInput,
  SearchOptions,
  AddIcon,
  FilterIcon,
  FiltersAppliedBadge,
} from './styled';

import type {
  SetSidebarFiltersOpen,
  SetIssuesSearchValue,
} from '../../../../types';

type Props = {
  host: string,
  protocol: string,
  currentProjectId: string,
  searchValue: string,
  sidebarFiltersIsOpen: boolean,
  setSidebarFiltersOpen: SetSidebarFiltersOpen,
  setIssuesSearchValue: SetIssuesSearchValue,
  filtersApplied: boolean,
}

const IssuesHeader: StatelessFunctionalComponent<Props> = ({
  searchValue,
  sidebarFiltersIsOpen,
  setSidebarFiltersOpen,
  setIssuesSearchValue,
  setUiState,
  filtersApplied,
  currentProjectId,
  host,
  protocol,
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
      <span className="pointer">
        <AddIcon
          label="Add"
          size="medium"
          onClick={() => {
            ipcRenderer.send(
              'open-create-issue-window',
              `${protocol}://${host}/secure/CreateIssue.jspa?pid=${currentProjectId}`,
            );
          }}
        />
        <FilterIcon
          label="Filter"
          size="medium"
          primaryColor={sidebarFiltersIsOpen ? '#0052CC' : '#333333'}
          onClick={() => {
            setUiState('sidebarFiltersIsOpen', !sidebarFiltersIsOpen);
          }}
        />
      </span>
      {filtersApplied &&
        <FiltersAppliedBadge />
      }
    </SearchOptions>
  </SearchBar>;

function mapStateToProps(state) {
  return {
    host: state.profile.host,
    protocol: state.profile.protocol,
    currentProjectId: getCurrentProjectId(state),
    searchValue: getIssuesSearchValue(state),
    sidebarFiltersIsOpen: getUiState('sidebarFiltersIsOpen')(state),
    // filtersApplied: getFiltersApplied(state),
    filtersApplied: false,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...uiActions,
    ...issuesActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssuesHeader);
