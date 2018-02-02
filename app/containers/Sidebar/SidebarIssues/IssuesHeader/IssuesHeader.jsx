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
  projectsActions,
  uiActions,
} from 'actions';
import {
  getCurrentProjectId,
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
  setUiState,
  filtersApplied,
  currentProjectId,
  fetchProjectStatusesRequest,
  filterStatusesIsFetched,
  host,
  protocol,
  refetchIssuesRequest,
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
        setUiState('issuesSearch', ev.target.value);
        refetchIssuesRequest(true);
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
            if (!filterStatusesIsFetched) {
              fetchProjectStatusesRequest();
            }
            setUiState('sidebarFiltersIsOpen', !sidebarFiltersIsOpen);
          }}
        />
      </span>
      {(filtersApplied !== 0) &&
        <FiltersAppliedBadge />
      }
    </SearchOptions>
  </SearchBar>;

function mapStateToProps(state) {
  const filters = getUiState('issuesFilters')(state);
  return {
    host: getUiState('host')(state),
    protocol: getUiState('protocol')(state),
    currentProjectId: getCurrentProjectId(state),
    searchValue: getUiState('issuesSearch')(state),
    sidebarFiltersIsOpen: getUiState('sidebarFiltersIsOpen')(state),
    filterStatusesIsFetched: getUiState('filterStatusesIsFetched')(state),
    filtersApplied: filters.type.length || filters.status.length || filters.assignee.length,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...uiActions,
    ...issuesActions,
    ...projectsActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssuesHeader);
