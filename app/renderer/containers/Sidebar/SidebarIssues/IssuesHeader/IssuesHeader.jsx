// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';

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

import * as S from './styled';

type Props = {
  searchValue: string,
  filterStatusesIsFetched: boolean,
  sidebarFiltersIsOpen: boolean,
  filtersApplied: boolean,
  currentProjectId: string,
  dispatch: Dispatch,
};

const IssuesHeader: StatelessFunctionalComponent<Props> = ({
  searchValue,
  filterStatusesIsFetched,
  sidebarFiltersIsOpen,
  filtersApplied,
  currentProjectId,
  dispatch,
}: Props): Node => (
  <S.SearchBar>
    <S.SearchIcon
      label="Search"
      size="medium"
    />
    <S.SearchInput
      placeholder="Search issue"
      type="text"
      value={searchValue}
      onChange={(ev) => {
        dispatch(uiActions.setUiState({
          issuesSearch: ev.target.value,
        }));
        dispatch(issuesActions.refetchIssuesRequest(true));
      }}
    />
    <S.SearchOptions>
      <span className="pointer">
        <span
          onClick={() => {
            dispatch(
              issuesActions.showIssueFormWindow({
                projectId: currentProjectId,
              }),
            );
          }}
        >
          <S.AddIcon
            label="Add"
            size="medium"
          />
        </span>
        {
          currentProjectId
          && (
            <span
              onClick={() => {
                if (!filterStatusesIsFetched) {
                  dispatch(projectsActions.fetchProjectStatusesRequest());
                }
                dispatch(uiActions.setUiState({
                  sidebarFiltersIsOpen: !sidebarFiltersIsOpen,
                }));
              }}
            >
              <S.FilterIcon
                label="Filter"
                size="medium"
                primaryColor={sidebarFiltersIsOpen ? '#0052CC' : '#333333'}
              />
            </span>
          )
        }
      </span>
      {!!filtersApplied
        && <S.FiltersAppliedBadge />
      }
    </S.SearchOptions>
  </S.SearchBar>
);

function mapStateToProps(state) {
  const {
    issuesSourceType,
    issuesSourceId,
    issuesSprintId,
  } = getUiState([
    'issuesSourceType',
    'issuesSourceId',
    'issuesSprintId',
  ])(state);
  const filterKey = `${issuesSourceType}_${issuesSourceId}_${issuesSprintId}`;
  const filters = getUiState('issuesFilters')(state)[filterKey] || ({
    type: [],
    status: [],
    assignee: [],
  });
  return {
    currentProjectId: getCurrentProjectId(state),
    searchValue: getUiState('issuesSearch')(state),
    sidebarFiltersIsOpen: getUiState('sidebarFiltersIsOpen')(state),
    filterStatusesIsFetched: getUiState('filterStatusesIsFetched')(state),
    filtersApplied: filters?.type?.length || filters?.status?.length || filters?.assignee?.length,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(IssuesHeader);
