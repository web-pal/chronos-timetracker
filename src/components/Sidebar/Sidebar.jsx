import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';
import SidebarItems from './SidebarItems/SidebarItems';

const Sidebar = ({ items, current, currentProjectId, onItemClick }) =>
  <Flex column className="sidebar">
    {currentProjectId
      ? <SidebarItems
        items={items}
        current={current}
        onItemClick={onItemClick}
      />
      : <span className="sidebar-nothing-selected">
        select project from dropdown above
      </span>
    }
  </Flex>;

Sidebar.propTypes = {
  current: PropTypes.number,
  currentProjectId: PropTypes.number,
  items: PropTypes.object,
  onItemClick: PropTypes.func,
  header: PropTypes.string,
};

export default Sidebar;
