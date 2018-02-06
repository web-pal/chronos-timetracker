// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Dispatch,
  Filter,
} from 'types';

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


type Props = {
  filters: Filter,
  options: Array<any>,
  issuesCount: number,
  issuesFetching: boolean,
  optionsFetching: boolean,
  dispatch: Dispatch,
};

const SidebarFilters: StatelessFunctionalComponent<Props> = ({
  filters,
  options,
  issuesCount,
  issuesFetching,
  optionsFetching,
  dispatch,
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
                      dispatch(uiActions.setIssuesFilters(
                        type.key,
                        [!checked && value].filter(Boolean),
                      ));
                    } else {
                      dispatch(uiActions.setIssuesFilters(
                        type.key,
                        !checked ?
                          [...filters[type.key], value] :
                          filters[type.key].filter(f => f !== value),
                      ));
                    }
                    dispatch(issuesActions.refetchIssuesRequest(true));
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
            dispatch(uiActions.setIssuesFilters('assignee', []));
            dispatch(uiActions.setIssuesFilters('status', []));
            dispatch(uiActions.setIssuesFilters('type', []));
            dispatch(issuesActions.refetchIssuesRequest());
          }}
        >
          Clear filters
        </Button>
        <Button
          appearance="primary"
          onClick={() => {
            dispatch(uiActions.setUiState(
              'sidebarFiltersIsOpen',
              false,
            ));
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

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(SidebarFilters);
