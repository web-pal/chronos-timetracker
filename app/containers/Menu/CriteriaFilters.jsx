import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as issuesActions from '../../actions/issues';

import { getAllIssuesTypes, getAllSubIssuesTypes, getAllIssuesStatuses } from '../../selectors/issues';

import Flex from '../../components/Base/Flex/Flex';
import FilterCriteria from '../../components/Sidebar/CriteriaFilters/FilterCriteria';

const handleFilterOfFilters = (f, filterName) => ev => f(ev.target.value, filterName);

const CriteriaFilters = ({
  sidebarType,
  showingFilterCriteriaBlock, setShowingFilterCriteriaBlock,
  AllIssuesTypes, AllSubIssuesTypes, AllIssuesStatuses,
  issueFilterOfFiltersTypes, issueFilterOfFiltersStatus, issueFilterOfFiltersAssignee,
  setFilterOfIssuesFiltersValue,
}) =>
  <Flex
    row
    className={[
      'sidebar-filter-item sidebar-filter-item--criterias',
      `${sidebarType === 'Recent' ? 'hidden' : ''}`,
    ].join(' ')}
  >
    <Flex column centered className={'sidebar-filter-criterias'} >
      <Flex row centered>
        <FilterCriteria
          name="Type"
          isOpen={showingFilterCriteriaBlock === 'Type'}
          handleFilterOfFilters={handleFilterOfFilters(setFilterOfIssuesFiltersValue, 'Type')}
          filterOfFilters={issueFilterOfFiltersTypes}
          options={[{ header: 'Standard Issue Types', values: AllIssuesTypes }, { header: 'Sub-Task Issue Types', values: AllSubIssuesTypes }]}
          handleClick={setShowingFilterCriteriaBlock}
        />
        <FilterCriteria
          name="Status"
          isOpen={showingFilterCriteriaBlock === 'Status'}
          handleFilterOfFilters={handleFilterOfFilters(setFilterOfIssuesFiltersValue, 'Status')}
          filterOfFilters={issueFilterOfFiltersStatus}
          options={[{ values: AllIssuesStatuses }]}
          handleClick={setShowingFilterCriteriaBlock}
        />
        <FilterCriteria
          name="Assignee"
          isOpen={showingFilterCriteriaBlock === 'Assignee'}
          handleFilterOfFilters={handleFilterOfFilters(setFilterOfIssuesFiltersValue, 'Assignee')}
          filterOfFilters={issueFilterOfFiltersAssignee}
          options={[{ values: [{ name: 'Current User' }, { name: 'Unassigned' }] }]}
          handleClick={setShowingFilterCriteriaBlock}
        />
      </Flex>
    </Flex>
  </Flex>
;

CriteriaFilters.propTypes = {
  sidebarType: PropTypes.string.isRequired,
  showingFilterCriteriaBlock: PropTypes.string.isRequired,
  setShowingFilterCriteriaBlock: PropTypes.func.isRequired,
  AllSubIssuesTypes: PropTypes.array.isRequired,
  AllIssuesTypes: PropTypes.array.isRequired,
  AllIssuesStatuses: PropTypes.array.isRequired,
  issueFilterOfFiltersTypes: PropTypes.string.isRequired,
  issueFilterOfFiltersStatus: PropTypes.string.isRequired,
  issueFilterOfFiltersAssignee: PropTypes.string.isRequired,
  setFilterOfIssuesFiltersValue: PropTypes.string.isRequired,
};

function mapStateToProps({ issues }) {
  const AllSubIssuesTypes = getAllSubIssuesTypes({ issues });
  const AllIssuesTypes = getAllIssuesTypes({ issues });

  const AllIssuesStatuses = getAllIssuesStatuses({ issues });

  return {
    showingFilterCriteriaBlock: issues.meta.showingFilterCriteriaBlock,
    AllSubIssuesTypes,
    AllIssuesTypes,
    AllIssuesStatuses,
    issueFilterOfFiltersTypes: issues.meta.issueFilterOfFilters_Type,
    issueFilterOfFiltersStatus: issues.meta.issueFilterOfFilters_Status,
    issueFilterOfFiltersAssignee: issues.meta.issueFilterOfFilters_Assignee,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CriteriaFilters);
