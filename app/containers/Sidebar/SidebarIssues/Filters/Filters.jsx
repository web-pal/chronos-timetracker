// @flow
import React from 'react';
import pull from 'lodash.pull';
import {
  connect,
} from 'react-redux';
import {
  bindActionCreators,
} from 'redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import Button, {
  ButtonGroup,
} from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';

import {
  issuesActions,
  uiActions,
} from 'actions';
import {
  getResourceMeta,
  getIssueTypes,
  getUserData,
  getIssueStatuses,
  getIssueFilters,
  getIssuesTotalCount,
  getIssuesFetching,
  getFilterOptions,
} from 'selectors';
import {
  H200,
} from 'styles/typography';

import {
  FiltersContainer,
  FilterItems,
  FilterItem,
  FilterOptions,
  FilterActionsContainer,
  IssuesFoundText,
} from './styled';
import FilterOption from './FilterOption';

import type {
  SetIssuesFilter,
  IssueType,
  IssueStatus,
  IssueFilters,
  SetSidebarFiltersOpen,
} from '../../../../types';


type Props = {
  setIssuesFilter: SetIssuesFilter,
  filters: IssueFilters,
  issuesCount: number,
  fetching: boolean,
  setSidebarFiltersOpen: SetSidebarFiltersOpen
};

const SidebarFilters: StatelessFunctionalComponent<Props> = ({
  setIssuesFilter,
  filters,
  issuesCount,
  fetching,
  setSidebarFiltersOpen,
  options,
}: Props): Node => (
  <FiltersContainer>
    {console.log(options)}
    <FilterItems>
      {options.map(type =>
        <FilterItem key={type.key}>
          <H200 style={{ padding: '10px 0 4px 10px', display: 'block' }}>
            {type.name}
          </H200>
          <FilterOptions>
            {type.options.map(option => (
              <FilterOption
                key={option.id}
                option={option}
                isChecked={false}
                onChange={(value, checked) => {
                  let newFilters;
                  if (option.key === 'assignee') {
                    newFilters = [];
                  } else {
                    newFilters = filters[option.key];
                  }
                  if (!checked) {
                    newFilters.push(value);
                  } else {
                    pull(newFilters, value);
                  }
                  setIssuesFilter(newFilters, option.key);
                }}
                showIcons={type.showIcons}
              />
            ))}
          </FilterOptions>
        </FilterItem>)
      }
    </FilterItems>
    <FilterActionsContainer>
      <IssuesFoundText>
        <span style={{ marginRight: 3 }}>Issues found:</span>
        {fetching ? <Spinner size="small" /> : <span>{issuesCount}</span>}
      </IssuesFoundText>
      <ButtonGroup>
        <Button
          onClick={() => {
            setIssuesFilter([], 'assignee');
            setIssuesFilter([], 'status');
            setIssuesFilter([], 'type');
          }}
        >
          Clear filters
        </Button>
        <Button
          appearance="primary"
          onClick={() => setSidebarFiltersOpen(false)}
        >
          Close
        </Button>
      </ButtonGroup>
    </FilterActionsContainer>
  </FiltersContainer>
);

function mapStateToProps(state) {
  return {
    options: getFilterOptions(state),
    filters: getIssueFilters(state),
    issuesCount: getResourceMeta(
      'issues',
      'filterIssuesTotalCount',
    )(state),
    fetching: getIssuesFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...uiActions, ...issuesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarFilters);
