// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  bindActionCreators,
} from 'redux';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';

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
  getFilterOptions,
  getUiState,
} from 'selectors';
import {
  FullPageSpinner,
} from 'styles';

import {
  FiltersContainer,
  FilterName,
  FilterItems,
  FilterItem,
  FilterOptions,
  FilterActionsContainer,
  IssuesFoundContainer,
  IssuesFoundText,
} from './styled';
import FilterOption from './FilterOption';

import type {
  SetIssuesFilter,
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
  setUiState,
  setIssuesFilters,
  filters,
  issuesCount,
  issuesFetching,
  options,
  optionsFetching,
  refetchIssuesRequest,
}: Props): Node => (
  <FiltersContainer>
    {optionsFetching ?
      <FullPageSpinner>
        <Spinner size="xlarge" />
      </FullPageSpinner> :
      <FilterItems>
        {options.map(type =>
          <FilterItem key={type.key}>
            <FilterName>
              {type.name}
            </FilterName>
            <FilterOptions>
              {type.options.map(option => (
                <FilterOption
                  key={option.id}
                  option={option}
                  isChecked={filters[type.key].includes(option.id)}
                  onChange={(value, checked) => {
                    if (type.key === 'assignee') {
                      setIssuesFilters(
                        type.key,
                        [!checked && value].filter(Boolean),
                      );
                    } else {
                      setIssuesFilters(
                        type.key,
                        !checked ?
                          [...filters[type.key], value] :
                          filters[type.key].filter(f => f !== value),
                      );
                    }
                    refetchIssuesRequest(true);
                  }}
                  showIcons={type.showIcons}
                />
              ))}
            </FilterOptions>
          </FilterItem>)
        }
      </FilterItems>
    }
    <FilterActionsContainer>
      <IssuesFoundContainer>
        <IssuesFoundText>
          Issues found:
        </IssuesFoundText>
        {issuesFetching ?
          <Spinner size="small" /> :
          <span>{issuesCount}</span>
        }
      </IssuesFoundContainer>
      <ButtonGroup>
        <Button
          onClick={() => {
            setIssuesFilters('assignee', []);
            setIssuesFilters('status', []);
            setIssuesFilters('type', []);
            refetchIssuesRequest();
          }}
        >
          Clear filters
        </Button>
        <Button
          appearance="primary"
          onClick={() => {
            setUiState('sidebarFiltersIsOpen', false);
          }}
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
    optionsFetching: getResourceStatus(
      state,
      'issuesTypes.requests.issuesTypes.status',
    ).pending,
    filters: getUiState('issuesFilters')(state),
    issuesCount: getResourceMeta(
      'issues',
      'filterIssuesTotalCount',
    )(state),
    issuesFetching: getResourceStatus(
      state,
      'issues.requests.filterIssues.status',
    ).pending,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...uiActions,
    ...issuesActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarFilters);
