// @flow
import React from 'react';
import pull from 'lodash.pull';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { issuesActions } from 'actions';
import {
  getIssueTypes,
  getUserData,
  getIssueStatuses,
  getIssueFilters,
} from 'selectors';
import { H200 } from 'styles/typography';

import { FiltersContainer, FilterItems, FilterItem, FilterOptions } from './styled';
import FilterOption from './FilterOption';
import getCriteriaFilters from './getCriteriaFilters';

import type { SetIssuesFilter, IssueType, IssueStatus, IssueFilters } from '../../../types';

// const sortOptions = fromJS([
//   { label: 'Proprity', value: 'all' },
//   { label: 'Date', value: 'me' },
//   { label: 'Name', value: 'me' },
// ]);
//
type Props = {
  setIssuesFilter: SetIssuesFilter,
  issueTypes: Array<IssueType>,
  issueStatuses: Array<IssueStatus>,
  filters: IssueFilters,
  selfKey: string,
};

const SidebarFilters: StatelessFunctionalComponent<Props> = ({
  setIssuesFilter,
  issueTypes,
  issueStatuses,
  filters,
  selfKey,
}: Props): Node => (
  <FiltersContainer>
    <FilterItems>
      {getCriteriaFilters({ issueTypes, issueStatuses, selfKey }).map(criteria =>
        <FilterItem key={criteria.name}>
          <H200 style={{ padding: '10px 0 4px 10px', display: 'block' }}>
            {criteria.name}
          </H200>
          <FilterOptions>
            {criteria.options.map(option => (
              <FilterOption
                key={option.id}
                option={option}
                isChecked={filters[criteria.key].includes(option.id)}
                onChange={(value, checked) => {
                  let _filters;
                  if (criteria.key === 'assignee') {
                    _filters = [];
                  } else {
                    _filters = filters[criteria.key];
                  }
                  if (!checked) {
                    _filters.push(value);
                  } else {
                    pull(_filters, value);
                  }
                  setIssuesFilter(_filters, criteria.key);
                }}
                showIcons={criteria.showIcons}
              />
            ))}
          </FilterOptions>
        </FilterItem>,
      )}
    </FilterItems>
  </FiltersContainer>
);

function mapStateToProps(state) {
  return {
    issueTypes: getIssueTypes(state),
    issueStatuses: getIssueStatuses(state),
    filters: getIssueFilters(state),
    selfKey: getUserData(state).key,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarFilters);
