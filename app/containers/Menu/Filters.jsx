import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as issuesActions from '../../actions/issues';
import { getAllIssuesTypes, getAllSubIssuesTypes, getAllIssuesStatuses } from '../../selectors';

import { FiltersContainer, FilterItems } from '../../components/Sidebar/Filters/styled';
import FiltersSection from '../../components/Sidebar/Filters/FiltersSection';
import getCriteriaFilters from './getCriteriaFilters';

// const sortOptions = fromJS([
//   { label: 'Proprity', value: 'all' },
//   { label: 'Date', value: 'me' },
//   { label: 'Name', value: 'me' },
// ]);

const Filters = (props) => (
  <FiltersContainer>
    <FilterItems>
      {console.log(getCriteriaFilters(props))}
      {getCriteriaFilters(props).map(criteria =>
        <FiltersSection
          key={criteria.criteriaKey}
          title={criteria.name}
          options={criteria.options[0].values}
          handleCriteriaSet={props.setIssuesCriteriaFilter}
          {...criteria}
        />,
      )}
    </FilterItems>
  </FiltersContainer>
);

/* eslint-disable react/no-unused-prop-types */
Filters.propTypes = {
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
/* eslint-enable react/no-unused-prop-types */

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
    showPanel: issues.meta.filterCriteriaPanel && issues.meta.fetched,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
