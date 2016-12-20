import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';
import SidebarItems from './SidebarItems/SidebarItems';

const spinner = require('../../assets/images/ring-alt.svg');

const Sidebar = ({
  items, tracking, current, currentProjectId, onResolveFilter, fetching, refreshIssues,
  onItemClick, onFilterChange, onFilterClear, filterValue, resolveFilter,
}) =>
  <Flex column className="sidebar">
    {fetching === 'issues' && 
      <img src={spinner} className="issues-spinner" />
    }
    {currentProjectId
      ? <SidebarItems
        items={items}
        current={current}
        tracking={tracking}
        filterValue={filterValue}
        resolveFilter={resolveFilter}
        refreshIssues={refreshIssues}
        onFilterChange={onFilterChange}
        onFilterClear={onFilterClear}
        onResolveFilter={onResolveFilter}
        onItemClick={onItemClick}
      />
      : <span className="sidebar-nothing-selected">
        select project from dropdown above
      </span>
    }
  </Flex>;

Sidebar.propTypes = {
  current: PropTypes.string,
  tracking: PropTypes.string,
  currentProjectId: PropTypes.number,
  items: PropTypes.object,
  filterValue: PropTypes.string,
  fetching: PropTypes.string,
  refreshIssues: PropTypes.func.isRequired,
  resolveFilter: PropTypes.bool.isRequired,
  onFilterClear: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onResolveFilter: PropTypes.func.isRequired,
  onItemClick: PropTypes.func,
};

export default Sidebar;
