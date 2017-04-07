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
            },
            {
              name: 'Status',
              criteriaKey: 'Status',
              options: [{ key: 'Status', values: AllIssuesStatuses }],
              filterOfFilters: issueFilterOfFiltersStatus,
              isActive: isStatusFilterActvie,
              isOpen: showFilterCriteriaStatus,
            },
            {
              name: 'Assignee',
              criteriaKey: 'Assignee',
              options: [{ key: 'Assignee', values: AllIssuesAssignee }],
              filterOfFilters: issueFilterOfFiltersAssignee,
              isActive: isAssigneeFilterActvie,
              hideFilterOfFiltersField: true,
              isOpen: showFilterCriteriaAssignee,
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
  showFilterCriteriaType: PropTypes.bool.isRequired,
  showFilterCriteriaStatus: PropTypes.bool.isRequired,
  showFilterCriteriaAssignee: PropTypes.bool.isRequired,
};

function mapStateToProps({ ui, issues }) {
  const AllSubIssuesTypes = getAllSubIssuesTypes({ issues });
  const AllIssuesTypes = getAllIssuesTypes({ issues });
  const AllIssuesAssignee = issues.meta.issueAssigneeIds.map(id =>
    issues.meta.issuesCriteriaOptionsAssignee[id]);

  const AllIssuesStatuses = getAllIssuesStatuses({ issues });

  return {
    sidebarType: ui.sidebarType,
    AllSubIssuesTypes,
    AllIssuesTypes,
    AllIssuesStatuses,
    AllIssuesAssignee,
    showFilterCriteriaType: issues.meta.showFilterCriteriaType,
    showFilterCriteriaStatus: issues.meta.showFilterCriteriaStatus,
    showFilterCriteriaAssignee: issues.meta.showFilterCriteriaAssignee,
    isStatusFilterActvie: !!issues.meta.issueCurrentCriteriaFilterStatus.length,
    isTypeFilterActvie: !!issues.meta.issueCurrentCriteriaFilterType.length,
    isAssigneeFilterActvie: !!issues.meta.issueCurrentCriteriaFilterAssignee.length,
    issueFilterOfFiltersTypes: issues.meta.issueFilterOfFiltersType,
    issueFilterOfFiltersStatus: issues.meta.issueFilterOfFiltersStatus,
    issueFilterOfFiltersAssignee: issues.meta.issueFilterOfFiltersAssignee,
    showPanel: issues.meta.filterCriteriaPanel,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CriteriaFilters);
