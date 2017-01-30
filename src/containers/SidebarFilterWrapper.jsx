import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as filterActions from '../actions/filter';
import * as issuesActions from '../actions/issues';

import SidebarFilterItem from
  '../components/Sidebar/SidebarItems/SidebarFilterItem/SidebarFilterItem';

const SidebarFilterWrapper = ({
  filterValue,
  resolveFilterValue,
  sidebarType,
  clearFilter,
  changeFilter,
  changeResolveFilter,
  clearIssues,
  fetchIssues,
}) =>
  <SidebarFilterItem
    onChange={changeFilter}
    value={filterValue}
    onClear={clearFilter}
    onResolveFilter={changeResolveFilter}
    resolveFilter={resolveFilterValue}
    refreshIssues={() => {
      clearIssues();
      fetchIssues({ startIndex: 0, stopIndex: 20 }, true);
    }}
    hidden={sidebarType === 'Recent'}
  />;

SidebarFilterWrapper.propTypes = {
  filterValue: PropTypes.string,
  resolveFilterValue: PropTypes.bool.isRequired,
  sidebarType: PropTypes.string.isRequired,
  clearFilter: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,
  changeResolveFilter: PropTypes.func.isRequired,
};

function mapStateToProps({ filter, ui }) {
  return {
    filterValue: filter.value,
    resolveFilterValue: filter.resolveValue,
    sidebarType: ui.sidebarType,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...filterActions, ...issuesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarFilterWrapper);
