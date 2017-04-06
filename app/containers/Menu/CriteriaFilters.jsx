import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
  issueFilterOfFiltersTypes, issueFilterOfFiltersStatus, issueFilterOfFiltersAssignee,
  setFilterOfIssuesFiltersValue, AllIssuesAssignee,
  setIssuesCriteriaFilter,
  isStatusFilterActvie,
  isTypeFilterActvie,
  isAssigneeFilterActvie,
  showPanel,
  showFilterCriteria_Types,
  showFilterCriteria_Status,
  showFilterCriteria_Assignee,
}) => (
  showPanel
  ? <Flex
    row
    className={[
      'sidebar-filter-item sidebar-filter-item--criterias',
      `${sidebarType === 'Recent' ? 'hidden' : ''}`,
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
              isOpen: showFilterCriteria_Types,
            },
            {
              name: 'Status',
              criteriaKey: 'Status',
              options: [{ key: 'Status', values: AllIssuesStatuses }],
              filterOfFilters: issueFilterOfFiltersStatus,
              isActive: isStatusFilterActvie,
              isOpen: showFilterCriteria_Status,
            },
            {
              name: 'Assignee',
              criteriaKey: 'Assignee',
              options: [{ key: 'Assignee', values: AllIssuesAssignee }],
              filterOfFilters: issueFilterOfFiltersAssignee,
              isActive: isAssigneeFilterActvie,
              hideFilterOfFiltersField: true,
              isOpen: showFilterCriteria_Assignee,
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
  AllSubIssuesTypes: PropTypes.array.isRequired,
  AllIssuesTypes: PropTypes.array.isRequired,
  AllIssuesStatuses: PropTypes.array.isRequired,
  issueFilterOfFiltersTypes: PropTypes.string.isRequired,
  issueFilterOfFiltersStatus: PropTypes.string.isRequired,
  issueFilterOfFiltersAssignee: PropTypes.string.isRequired,
  setFilterOfIssuesFiltersValue: PropTypes.func.isRequired,
  setIssuesCriteriaFilter: PropTypes.func.isRequired,
  AllIssuesAssignee: PropTypes.array.isRequired,
  isStatusFilterActvie: PropTypes.bool.isRequired,
  isTypeFilterActvie: PropTypes.bool.isRequired,
  isAssigneeFilterActvie: PropTypes.bool.isRequired,
  showPanel: PropTypes.bool.isRequired,
  showFilterCriteria_Types: PropTypes.bool.isRequired,
  showFilterCriteria_Status: PropTypes.bool.isRequired,
  showFilterCriteria_Assignee: PropTypes.bool.isRequired,
};

function mapStateToProps({ ui, issues }) {
  const AllSubIssuesTypes = getAllSubIssuesTypes({ issues });
  const AllIssuesTypes = getAllIssuesTypes({ issues });
  const AllIssuesAssignee = issues.meta.issueAssigneeIds.map(id =>
    issues.meta.issuesCriteriaOptions_Assignee[id]);

  const AllIssuesStatuses = getAllIssuesStatuses({ issues });

  return {
    sidebarType: ui.sidebarType,
    AllSubIssuesTypes,
    AllIssuesTypes,
    AllIssuesStatuses,
    AllIssuesAssignee,
    showFilterCriteria_Types: issues.meta.showFilterCriteria_Types,
    showFilterCriteria_Status: issues.meta.showFilterCriteria_Status,
    showFilterCriteria_Assignee: issues.meta.showFilterCriteria_Assignee,
    isStatusFilterActvie: !!issues.meta.issueCurrentCriteriaFilter_Status.length,
    isTypeFilterActvie: !!issues.meta.issueCurrentCriteriaFilter_Type.length,
    isAssigneeFilterActvie: !!issues.meta.issueCurrentCriteriaFilter_Assignee.length,
    issueFilterOfFiltersTypes: issues.meta.issueFilterOfFilters_Type,
    issueFilterOfFiltersStatus: issues.meta.issueFilterOfFilters_Status,
    issueFilterOfFiltersAssignee: issues.meta.issueFilterOfFilters_Assignee,
    showPanel: issues.meta.filterCriteriaPanel,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CriteriaFilters);
