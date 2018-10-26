// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  ipcRenderer,
} from 'electron';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Dispatch,
} from 'types';

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

type Props = {
  searchValue: string,
  filterStatusesIsFetched: boolean,
  sidebarFiltersIsOpen: boolean,
  filtersApplied: boolean,
  currentProjectId: string,
  dispatch: Dispatch,
}

const IssuesHeader: StatelessFunctionalComponent<Props> = ({
  searchValue,
  filterStatusesIsFetched,
  sidebarFiltersIsOpen,
  filtersApplied,
  currentProjectId,
  dispatch,
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
        dispatch(uiActions.setUiState(
          'issuesSearch',
          ev.target.value,
        ));
        dispatch(issuesActions.refetchIssuesRequest(true));
      }}
    />
    <SearchOptions>
      <span className="pointer">
        <AddIcon
          label="Add"
          size="medium"
          onClick={() => {
            ipcRenderer.send(
              'show-issue-window',
              {
                projectId: currentProjectId,
              },
            );
          }}
        />
        <FilterIcon
          label="Filter"
          size="medium"
          primaryColor={sidebarFiltersIsOpen ? '#0052CC' : '#333333'}
          onClick={() => {
            if (!filterStatusesIsFetched) {
              dispatch(projectsActions.fetchProjectStatusesRequest());
            }
            dispatch(uiActions.setUiState(
              'sidebarFiltersIsOpen',
              !sidebarFiltersIsOpen,
            ));
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
    currentProjectId: getCurrentProjectId(state),
    searchValue: getUiState('issuesSearch')(state),
    sidebarFiltersIsOpen: getUiState('sidebarFiltersIsOpen')(state),
    filterStatusesIsFetched: getUiState('filterStatusesIsFetched')(state),
    filtersApplied: filters.type.length || filters.status.length || filters.assignee.length,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(IssuesHeader);
