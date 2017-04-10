import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as issuesActions from '../../actions/issues';

import {
  getAllIssuesTypes,
  getAllSubIssuesTypes,
  getAllIssuesStatuses,
} from '../../selectors/issues';

import Flex from '../../components/Base/Flex/Flex';
import FilterCriteria from '../../components/Sidebar/CriteriaFilters/FilterCriteria';

const handleFilterOfFilters = (f, filterName) => ev => f(ev.target.value, filterName);


const CriteriaFilters = ({
  sidebarType,
  setShowingFilterCriteriaBlock,
  AllIssuesTypes, AllSubIssuesTypes, AllIssuesStatuses,
  issueFilterOfFiltersTypes, issueFilterOfFiltersStatus,
  setFilterOfIssuesFiltersValue,
  setIssuesCriteriaFilter,
  isStatusFilterActvie,
  isTypeFilterActvie,
  assigneeActiveFilters,
  showPanel,
  showFilterCriteriaType,
  showFilterCriteriaStatus,
  showFilterCriteriaAssignee,
}) => (
  (showPanel && sidebarType === 'All')
  ? <Flex
    row
    className={[
      'sidebar-filter-item sidebar-filter-item--criterias',
    ].join(' ')}
  >
    <Flex column centered className={'sidebar-filter-criterias'} >
      <Flex row centered>
        {
          [
            {
              name: 'Type',
              criteriaKey: 'Type',
              options: [
                { key: 'Standard', header: 'Standard Issue Types', values: AllIssuesTypes },
                { key: 'Sub', header: 'Sub-Task Issue Types', values: AllSubIssuesTypes },
              ],
              isActive: isTypeFilterActvie,
              filterOfFilters: issueFilterOfFiltersTypes,
              isOpen: showFilterCriteriaType,
              showIcons: true,
            },
            {
              name: 'Status',
              criteriaKey: 'Status',
              options: [{ key: 'Status', values: AllIssuesStatuses }],
              filterOfFilters: issueFilterOfFiltersStatus,
              isActive: isStatusFilterActvie,
              isOpen: showFilterCriteriaStatus,
              showIcons: false,
            },
            {
              name: 'Assignee',
              criteriaKey: 'Assignee',
              options: [{
                key: 'Assignee',
                values: fromJS([
                  { name: 'Unassigned', id: 'none', checked: assigneeActiveFilters.has('none') },
                  {
                    name: 'Current User',
                    id: 'currentUser',
                    checked: assigneeActiveFilters.has('currentUser'),
                  },
                ]),
              }],
              filterOfFilters: null,
              handleFilterOfFilters: null,
              isActive: !!assigneeActiveFilters.size,
              hideFilterOfFiltersField: true,
              isOpen: showFilterCriteriaAssignee,
              showIcons: false,
            },
          ].map(criteria =>
            <FilterCriteria
              key={criteria.criteriaKey}
              handleFilterOfFilters={
                handleFilterOfFilters(setFilterOfIssuesFiltersValue, criteria.criteriaKey)
              }
              handleClick={setShowingFilterCriteriaBlock}
              handleCriteriaSet={setIssuesCriteriaFilter}
              {...criteria}
            />,
          )
        }
      </Flex>
    </Flex>
  </Flex>
    : null
)
;

CriteriaFilters.propTypes = {
  sidebarType: PropTypes.string.isRequired,
  setShowingFilterCriteriaBlock: PropTypes.func.isRequired,
  AllSubIssuesTypes: ImmutablePropTypes.list.isRequired,
  AllIssuesTypes: ImmutablePropTypes.list.isRequired,
  AllIssuesStatuses: ImmutablePropTypes.list.isRequired,
  issueFilterOfFiltersTypes: PropTypes.string.isRequired,
  issueFilterOfFiltersStatus: PropTypes.string.isRequired,
  setFilterOfIssuesFiltersValue: PropTypes.func.isRequired,
  setIssuesCriteriaFilter: PropTypes.func.isRequired,
  isStatusFilterActvie: PropTypes.bool.isRequired,
  isTypeFilterActvie: PropTypes.bool.isRequired,
  assigneeActiveFilters: ImmutablePropTypes.set.isRequired,
  showPanel: PropTypes.bool.isRequired,
  showFilterCriteriaType: PropTypes.bool.isRequired,
  showFilterCriteriaStatus: PropTypes.bool.isRequired,
  showFilterCriteriaAssignee: PropTypes.bool.isRequired,
};

function mapStateToProps({ ui, issues }) {
  const AllSubIssuesTypes = getAllSubIssuesTypes({ issues });
  const AllIssuesTypes = getAllIssuesTypes({ issues });
  const AllIssuesStatuses = getAllIssuesStatuses({ issues });

  return {
    sidebarType: ui.sidebarType,
    AllSubIssuesTypes,
    AllIssuesTypes,
    AllIssuesStatuses,
    showFilterCriteriaType: issues.meta.showFilterCriteriaType,
    showFilterCriteriaStatus: issues.meta.showFilterCriteriaStatus,
    showFilterCriteriaAssignee: issues.meta.showFilterCriteriaAssignee,
    isStatusFilterActvie: !!issues.meta.issueCurrentCriteriaFilterStatus.size,
    isTypeFilterActvie: !!issues.meta.issueCurrentCriteriaFilterType.size,
    assigneeActiveFilters: issues.meta.issueCurrentCriteriaFilterAssignee,
    issueFilterOfFiltersTypes: issues.meta.issueFilterOfFiltersType,
    issueFilterOfFiltersStatus: issues.meta.issueFilterOfFiltersStatus,
    showPanel: issues.meta.filterCriteriaPanel,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CriteriaFilters);
