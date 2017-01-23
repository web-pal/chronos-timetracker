import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';
import SidebarItem from './SidebarItem/SidebarItem';
import RecentItem from './RecentItem/RecentItem';
import SidebarFilterWrapper from '../../../containers/SidebarFilterWrapper';
import InfiniteLoadingList from '../../Virtualized/InfiniteLoadingList';

const SidebarItems = ({
  items, current, onItemClick, tracking, issuesCount, fetchIssues, sidebarType
}) =>
  <Flex column style={{ height: '100%' }}>
    <SidebarFilterWrapper />
    <InfiniteLoadingList
      isRowLoaded={({ index }) => !!items.toList().get(index)}
      loadMoreRows={fetchIssues}
      rowCount={issuesCount}
      listProps={{
        autoSized: true,
        rowCount: issuesCount,
        rowHeight: 35,
        // eslint-disable-next-line react/prop-types
        rowRenderer: ({ index, key, style }) => {
          const item = items.toList().get(index);
          return sidebarType === 'Recent'
            ? (
            <RecentItem
              key={key}
              onClick={onItemClick}
              items={item || Immutable.List()}
              style={style}
              current={current}
              tracking={tracking}
            />
            )
            : (
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
  </Flex>;

SidebarItems.propTypes = {
  items: PropTypes.object,
  sidebarType: PropTypes.string,
  current: PropTypes.string,
  tracking: PropTypes.string,
  onItemClick: PropTypes.func.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  issuesCount: PropTypes.number,
};

export default SidebarItems;
