import React, { PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as uiActions from '../actions/ui';
import * as jiraActions from '../actions/jira';
import * as contextActions from '../actions/context';
import * as issuesActions from '../actions/issues';

import { getRecentIssuesWithWorklogs, getFilteredIssues } from '../selectors/';

import Sidebar from '../components/Sidebar/Sidebar';
import SidebarHeader from '../components/Sidebar/SidebarHeader/SidebarHeader';
import Flex from '../components/Base/Flex/Flex';

/* eslint-disable react/prop-types */
const SidebarWrapper = ({
  items,
  fetching,
  changeFilter,
  clearFilter,
  toggleResolveFilter,
  fetchIssues,
  fetchSettings,
  resolveFilter,
  currentProjectId,
  currentIssueId,
  trackingIssue,
  filterValue,
  selectIssue,
  sidebarType,
  setSidebarType,
  issuesCount,
}) =>
  <Flex column className="SidebarWrapper">
    <Flex row className="sidebar-header-wrap">
      <SidebarHeader
        active={sidebarType === 'Recent'}
        label="Recent"
        onClick={setSidebarType}
      />
      <SidebarHeader
        active={sidebarType === 'Search'}
        label="Search"
        onClick={setSidebarType}
      />
    </Flex>
    <Sidebar
      items={items}
      fetching={fetching}
      currentProjectId={currentProjectId}
      fetchIssues={fetchIssues}
      current={currentIssueId}
      tracking={trackingIssue}
      filterValue={filterValue}
      refreshIssues={() => {
        fetchIssues();
        fetchSettings();
      }}
      onFilterChange={changeFilter}
      onFilterClear={clearFilter}
      onItemClick={selectIssue}
      onResolveFilter={toggleResolveFilter}
      resolveFilter={resolveFilter}
      issuesCount={issuesCount}
    />
  </Flex>;

SidebarWrapper.propTypes = {
  items: PropTypes.object.isRequired,
  fetching: PropTypes.string,
  changeFilter: PropTypes.func.isRequired,
  clearFilter: PropTypes.func.isRequired,
  toggleResolveFilter: PropTypes.func.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  fetchSettings: PropTypes.func.isRequired,
  setSidebarType: PropTypes.func.isRequired,
  selectIssue: PropTypes.func.isRequired,
};

function mapStateToProps({ issues, worklogs, ui, context, tracker }) {
  const sidebarType = ui.sidebarType;
  const items = sidebarType === 'Recent'
      ? getRecentIssuesWithWorklogs({ issues, worklogs })
      : getFilteredIssues({ issues });
  return {
    items,
    resolveFilter: context.resolveFilter,
    currentProjectId: context.currentProjectId,
    currentIssueId: context.currentIssueId,
    trackingIssue: tracker.trackingIssue,
    filterValue: context.filterValue,
    sidebarType: ui.sidebarType,
    issuesCount: issues.meta.get('total'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...uiActions,
    ...jiraActions,
    ...contextActions,
    ...issuesActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarWrapper);
