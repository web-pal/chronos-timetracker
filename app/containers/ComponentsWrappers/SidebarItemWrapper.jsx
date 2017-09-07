import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as issuesActions from '../../actions/issues';
import * as worklogsActions from '../../actions/worklogs';
// import SidebarItem from '../../components/Sidebar/SidebarAllItems/SidebarItem';
// import SidebarRecentItem from '../../components/Sidebar/SidebarRecentItems/RecentItem';

import Issue from '../../components/Sidebar/Issue/Issue';

const SidebarItemWrapper = props => <Issue {...props} />;

SidebarItemWrapper.propTypes = {
  itemType: PropTypes.string.isRequired,
};

function formatSummary(summary) {
  return summary && summary.length > 25 ? `${summary.substr(0, 25)}...` : summary;
}

function makeMapStateToProps() {
  return ({ issues, worklogs }, { issue, worklog, itemType }) => {
    const selectedIssueId = issues.meta.selectedIssueId;
    const selectedWorklogId = worklogs.meta.selectedWorklogId;
    const trackingIssueId = issues.meta.trackingIssueId;

    let active = false;
    let activeGroup = active;
    let onTracking = false;
    let summary = '';
    if (issue && issue.size) {
      const id = issue.get('id');
      active = id !== undefined && selectedIssueId === id;
      onTracking = trackingIssueId === id;
      activeGroup = active;
      if (itemType === 'Recent') {
        active = selectedWorklogId === worklog.get('id');
        onTracking = trackingIssueId !== null && active;
      }
      summary = formatSummary(issue.get('fields').get('summary'));
    }
    return {
      active,
      activeGroup,
      onTracking,
      summary,
    };
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...issuesActions, ...worklogsActions }, dispatch);
}

export default connect(makeMapStateToProps, mapDispatchToProps)(SidebarItemWrapper);
