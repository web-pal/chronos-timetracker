import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as issuesActions from '../../actions/issues';

import { getAllIssues, getSearchResultIssues } from '../../selectors/issues';
import { getRecentWorklogsGroupedByDate } from '../../selectors/worklogs';

import Flex from '../../components/Base/Flex/Flex';
import LinearGradientSpinner from '../../components/Spinners/LinearGradientSpinner';
import SidebarNoItems from '../../components/Sidebar/SidebarNoItems';
import SidebarAllItems from '../../components/Sidebar/SidebarAllItems/SidebarAllItems';
import SidebarRecentItems from '../../components/Sidebar/SidebarRecentItems/SidebarRecentItems';


const SidebarItems = props =>
  <Flex column style={{ height: '100%' }}>
    <LinearGradientSpinner
      show={props.showSpinner}
      takeAllSpace
    />
    <SidebarNoItems
      show={!props.showSpinner && props.totalCount === 0 && props.sidebarType === 'All'}
    />
    {props.sidebarType === 'All' &&
      <SidebarAllItems {...props} />
    }
    {props.sidebarType === 'Recent' &&
      <SidebarRecentItems {...props} />
    }
  </Flex>;

SidebarItems.propTypes = {
  showSpinner: PropTypes.bool.isRequired,
  totalCount: PropTypes.number.isRequired,
  sidebarType: PropTypes.string.isRequired,
};

function mapStateToProps({ issues, worklogs, ui }) {
  let items = new Immutable.List();
  let showSpinner = true;
  const searchMode = issues.meta.searchValue.length > 0;
  if (ui.sidebarType === 'All') {
    showSpinner = (issues.meta.fetching && !issues.meta.fetched) || issues.meta.searchFetching;
    items = searchMode ? getSearchResultIssues({ issues }) : getAllIssues({ issues });
  } else {
    showSpinner = issues.meta.recentFetching;
    items = getRecentWorklogsGroupedByDate({ issues, worklogs });
  }
  const totalCount = searchMode ? items.size : issues.meta.totalCount;
  return {
    sidebarType: ui.sidebarType,
    showSpinner,
    totalCount,
    items,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarItems);
