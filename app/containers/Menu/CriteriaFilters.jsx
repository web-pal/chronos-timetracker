import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as issuesActions from '../../actions/issues';
import Flex from '../../components/Base/Flex/Flex';
import FilterCriteria from '../../components/Sidebar/CriteriaFilters/FilterCriteria';


const CriteriaFilters = ({
  sidebarType,
  showingFilterCriteriaBlock, setShowingFilterCriteriaBlock,
}) =>
  <Flex row className={`sidebar-filter-item sidebar-filter-item--criterias ${sidebarType === 'Recent' ? 'hidden' : ''}`}>
    <Flex column centered className={'sidebar-filter-criterias'} >
      <Flex row centered>
        <FilterCriteria name={'Type'} handleClick={setShowingFilterCriteriaBlock} isOpen={showingFilterCriteriaBlock === 'Type'} />
        <FilterCriteria name={'Status'} handleClick={setShowingFilterCriteriaBlock} isOpen={showingFilterCriteriaBlock === 'Status'} />
        <FilterCriteria name={'Assignee'} handleClick={setShowingFilterCriteriaBlock} isOpen={showingFilterCriteriaBlock === 'Assignee'} />
      </Flex>
    </Flex>
  </Flex>
;

CriteriaFilters.propTypes = {
  sidebarType: PropTypes.string.isRequired,
  showingFilterCriteriaBlock: PropTypes.string.isRequired,
  setShowingFilterCriteriaBlock: PropTypes.func.isRequired,
};

function mapStateToProps({ ui, issues }) {
  return {
    showingFilterCriteriaBlock: issues.meta.showingFilterCriteriaBlock,
    sidebarType: ui.sidebarType,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CriteriaFilters);
