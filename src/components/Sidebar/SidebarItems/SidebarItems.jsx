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
    {sidebarType === 'All'
      ? <InfiniteLoadingList
        isRowLoaded={({ index }) => !!items.toList().get(index)}
        minimumBatchSize={50}
        threshold={20}
        loadMoreRows={fetchIssues}
        rowCount={issuesCount}
        listProps={{
          autoSized: true,
          rowCount: issuesCount,
          rowHeight: 40,
          // eslint-disable-next-line react/prop-types
          rowRenderer: ({ index, key, style }) => {
            const item = items.toList().get(index);
            return (
              <SidebarItem
                key={key}
                onClick={onItemClick}
                item={item || Immutable.Map()}
                style={style}
                current={current}
                tracking={tracking}
              />
            );
          },
        }}
      />
        : <RecentItems
          items={items}
          current={current}
          tracking={tracking}
          onItemClick={onItemClick}
          fetching={fetching}
          selectRecent={selectRecent}
          recentSelected={recentSelected}
        />
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
