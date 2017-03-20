import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';
import SidebarItem from './SidebarItem/SidebarItem';
import RecentItems from './RecentItems/RecentItems';
import LinearGradientSpinner from '../../Spinners/LinearGradientSpinner';
import NoItems from './NoItems/NoItems';
import InfiniteLoadingList from '../../Virtualized/InfiniteLoadingList';

const SidebarItems = ({
  items, current, onItemClick, tracking, issuesCount, fetchIssues, sidebarType,
  fetching, selectRecent, recentSelected,
}) =>
  <Flex column style={{ height: '100%' }}>
    <LinearGradientSpinner show={fetching && items.size === 0} takeAllSpace />
    <NoItems show={!fetching && issuesCount === 0 && sidebarType === 'All'} />
    {sidebarType === 'All' &&
      <AllItems { ...props } />
    }
    {sidebarType === 'Recent' &&
      <RecentItems { ...props } />
    }
  </Flex>;

SidebarItems.propTypes = {
  items: PropTypes.object,
  sidebarType: PropTypes.string,
  current: PropTypes.string,
  tracking: PropTypes.string,
  onItemClick: PropTypes.func.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  issuesCount: PropTypes.number,
  fetching: PropTypes.bool.isRequired,
  selectRecent: PropTypes.func.isRequired,
  recentSelected: PropTypes.string,
};

export default SidebarItems;
