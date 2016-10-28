import React, { PropTypes } from 'react';

import SidebarItem from './SidebarItem/SidebarItem';

const SidebarItems = ({ items, current, onItemClick }) => {
  const sideBarItems = items.map((item, i) => {
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
        active={i === current}
        key={i}
        id={i}
      />
    );
  }
  );

  return (
    <ul className="sidebar-list">
      {sideBarItems}
    </ul>
  );
};

SidebarItems.propTypes = {
  items: PropTypes.object,
  current: PropTypes.number,
  onItemClick: PropTypes.func.isRequired,
};

export default SidebarItems;
