import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';
import SidebarItem from './SidebarItem/SidebarItem';
import SidebarFilterItem from './SidebarFilterItem/SidebarFilterItem';
import InfiniteLoadingList from '../../Virtualized/InfiniteLoadingList';

const SidebarItems = ({
  items, current, onItemClick, tracking, onResolveFilter, refreshIssues, issuesCount,
  onFilterChange, onFilterClear, filterValue, resolveFilter, fetchIssues,
}) => {
  const sideBarItems = items.map((item) => {
    if (item) {
      let label =
        item.get('displayName') ||
        item.get('name') ||
        item.getIn(['fields', 'summary']) ||
        item.get('key') ||
        item.getIn(['issue', 'summary']);
      if (label.length > 25) {
        label = `${label.substr(0, 25)}...`;
      }
      return (
        <SidebarItem
          onClick={onItemClick}
          label={label}
          active={item.get('id') === current}
          tracking={item.get('id') === tracking}
          resolved={item.getIn(['fields', 'resolution']) !== null}
          key={item.get('id')}
          id={item.get('id')}
        />
      );
    }
    return false;
  });

  return (
    <Flex column style={{ height: '100%' }}>
      <SidebarFilterItem
        onChange={onFilterChange}
        value={filterValue}
        onClear={onFilterClear}
        refreshIssues={refreshIssues}
        onResolveFilter={onResolveFilter}
        resolveFilter={resolveFilter}
      />
      <InfiniteLoadingList
        isRowLoaded={({ index }) => !!items.toList().get(index)}
        loadMoreRows={fetchIssues}
        rowCount={issuesCount}
        listProps={{
          autoSized: true,
          rowCount: issuesCount,
          rowHeight: 35,
          rowRenderer: ({ index, key, style }) => {
            const item = items.toList().get(index);
            return (
              <SidebarItem
                onClick={onItemClick}
                item={item}
                style={style}
              />
            );
          },
        }}
      />
    </Flex>
  );
};

SidebarItems.propTypes = {
  items: PropTypes.object,
  current: PropTypes.string,
  tracking: PropTypes.string,
  filterValue: PropTypes.string,
  resolveFilter: PropTypes.bool,
  onFilterClear: PropTypes.func.isRequired,
  refreshIssues: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onResolveFilter: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  issuesCount: PropTypes.number,
};

export default SidebarItems;
