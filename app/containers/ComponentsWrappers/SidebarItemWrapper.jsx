import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as issuesActions from '../../actions/issues';
import * as worklogsActions from '../../actions/worklogs';
import SidebarItem from '../../components/Sidebar/SidebarAllItems/SidebarItem';
import SidebarRecentItem from '../../components/Sidebar/SidebarRecentItems/RecentItem';

const SidebarItemWrapper = props =>
  (props.itemType === 'All' ?
    <SidebarItem {...props} /> :
    <SidebarRecentItem {...props} />
  );

SidebarItemWrapper.propTypes = {
  itemType: PropTypes.string.isRequired,
};

function makeMapStateToProps() {
  return ({ issues, worklogs }, { issue, worklog, itemType }) => {
    const id = issue.get('id');
    const selectedIssueId = issues.meta.selectedIssueId;
    const selectedWorklogId = worklogs.meta.selectedWorklogId;
    const trackingIssueId = issues.meta.trackingIssueId;

    let active = id !== undefined && selectedIssueId === id;
    const activeGroup = active;
    if (itemType === 'Recent') {
      active = selectedWorklogId === worklog.get('id');
    }
    const onTracking = trackingIssueId === id;
    return {
      active,
      activeGroup,
      onTracking,
    };
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...issuesActions, ...worklogsActions }, dispatch);
}

export default connect(makeMapStateToProps, mapDispatchToProps)(SidebarItemWrapper);
