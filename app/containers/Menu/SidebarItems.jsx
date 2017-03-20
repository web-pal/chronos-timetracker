import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as issuesActions from '../../actions/issues';

import { getAllIssues, getSearchResultIssues } from '../../selectors/issues';
import { getRecentWorklogsGroupedByDate } from '../../selectors/worklogs';

import Flex from '../../components/Base/Flex/Flex';
import LinearGradientSpinner from '../../components/Spinners/LinearGradientSpinner';
import NoItems from '../../components/Sidebar/SidebarItems/NoItems/NoItems';
import SidebarAllItems from '../../components/Sidebar/SidebarAllItems/SidebarAllItems';
import SidebarRecentItems from '../../components/Sidebar/SidebarRecentItems/SidebarRecentItems';


const SidebarItems = props =>
  <Flex column style={{ height: '100%' }}>
    <LinearGradientSpinner
      show={(props.fetching && !props.fetched) || props.searchFetching}
      takeAllSpace
    />
    <NoItems
      show={props.fetched && props.totalCount === 0 && props.sidebarType === 'All'}
    />
    {props.sidebarType === 'All' &&
      <SidebarAllItems {...props} />
    }
    {props.sidebarType === 'Recent' &&
      <SidebarRecentItems {...props} />
    }
  </Flex>;

SidebarItems.propTypes = {
  fetching: PropTypes.bool.isRequired,
  fetched: PropTypes.bool.isRequired,
  searchFetching: PropTypes.bool.isRequired,
  totalCount: PropTypes.number.isRequired,
  sidebarType: PropTypes.string.isRequired,
};

function mapStateToProps({ issues, ui }) {
  let items = new Immutable.List();
  const searchMode = issues.meta.searchValue.length > 0;
  if (ui.sidebarType === 'All') {
    items = searchMode ? getSearchResultIssues({ issues }) : getAllIssues({ issues });
  } else {
    items = getRecentWorklogsGroupedByDate({ issues });
  }
  const totalCount = searchMode ? items.size : issues.meta.totalCount;
  return {
    fetching: issues.meta.fetching,
    fetched: issues.meta.fetched,
    searchFetching: issues.meta.searchFetching,
    sidebarType: ui.sidebarType,
    totalCount,
    items,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarItems);
