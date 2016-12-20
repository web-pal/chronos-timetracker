import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';
import SidebarItem from './SidebarItem/SidebarItem';
import SidebarFilterItem from './SidebarFilterItem/SidebarFilterItem';

const SidebarItems = ({
  items, current, onItemClick, tracking, onResolveFilter, refreshIssues,
  onFilterChange, onFilterClear, filterValue, resolveFilter,
}) => {
  const sideBarItems = items.map((item, i) => {
    if (item) {
      let label =
        item.get('displayName') ||
        item.get('name') ||
        item.get('fields').get('summary') ||
        item.get('key');
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
    <Flex column>
      <SidebarFilterItem
        onChange={onFilterChange}
        value={filterValue}
        onClear={onFilterClear}
        refreshIssues={refreshIssues}
        onResolveFilter={onResolveFilter}
        resolveFilter={resolveFilter}
      />
      <div className="sidebar-list-wrapper">
        <ul className="sidebar-list">
          {sideBarItems}
        </ul>
      </div>
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
};

export default SidebarItems;
