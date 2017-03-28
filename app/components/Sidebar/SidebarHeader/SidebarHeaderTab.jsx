import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';

const SidebarHeaderTab = ({
  active,
  label,
  onClick,
}) =>
  <Flex
    column
    centered
    onClick={() => onClick(label)}
    className={`sidebar-header ${active ? 'active' : ''}`}
  >
    <span className="sidebar-header__label">
      {label}
    </span>
  </Flex>;

SidebarHeaderTab.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SidebarHeaderTab;
