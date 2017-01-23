import React, { PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as uiActions from '../actions/ui';
import * as jiraActions from '../actions/jira';
import * as issuesActions from '../actions/issues';
import * as settingsActions from '../actions/settings';

import {
  getRecentWorklogsGroupedByDate,
  getIssues,
  getSearchResultIssues,
  getSelectedIssueId,
  getSelectedProjectId,
} from '../selectors/';

import Sidebar from '../components/Sidebar/Sidebar';
import SidebarHeaderWrapper from './SidebarHeaderWrapper';
import Flex from '../components/Base/Flex/Flex';

/* eslint-disable react/prop-types */
const SidebarWrapper = ({
  items,
  fetching,
  fetchIssues,
  currentProjectId,
  currentIssueId,
  trackingIssue,
  selectIssue,
  sidebarType,
  setSidebarType,
  issuesCount,
}) =>
  <Flex column className="SidebarWrapper">
    <SidebarHeaderWrapper
      sidebarType={sidebarType}
      setSidebarType={setSidebarType}
    />
    <Sidebar
      items={items}
      fetching={fetching}
      currentProjectId={currentProjectId}
      fetchIssues={fetchIssues}
      current={currentIssueId}
      tracking={trackingIssue}
      onItemClick={selectIssue}
      issuesCount={issuesCount}
      sidebarType={sidebarType}
    />
  </Flex>;

SidebarWrapper.propTypes = {
  items: PropTypes.object.isRequired,
  fetching: PropTypes.string,
  fetchIssues: PropTypes.func.isRequired,
  fetchSettings: PropTypes.func.isRequired,
  setSidebarType: PropTypes.func.isRequired,
  selectIssue: PropTypes.func.isRequired,
};

function mapStateToProps({ issues, worklogs, projects, ui, tracker, filter }) {
  const sidebarType = ui.sidebarType;
  const items = sidebarType === 'Recent'
    ? getRecentWorklogsGroupedByDate({ worklogs, issues })
    : filter.value.length > 0
      ? getSearchResultIssues({ issues })
      : getIssues({ issues });
  const issuesCount = sidebarType === 'Recent'
    ? items.size
    : filter.value.length > 0
      ? issues.meta.get('searchResults').size
      : issues.meta.get('total');
  return {
    items,
    currentProjectId: getSelectedProjectId({ projects }),
    currentIssueId: getSelectedIssueId({ issues }),
    trackingIssue: tracker.trackingIssue,
    sidebarType: ui.sidebarType,
    issuesCount,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...uiActions,
    ...jiraActions,
    ...issuesActions,
    ...settingsActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarWrapper);
