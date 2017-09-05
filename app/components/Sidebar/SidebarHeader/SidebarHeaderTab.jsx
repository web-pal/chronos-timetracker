import React, { PropTypes } from 'react';

import { Tab } from './styled';

const SidebarHeaderTab = ({
  active,
  label,
  onClick,
}) =>
  <Tab
    active={active}
    onClick={() => onClick(label)}
  >
    {label}
  </Tab>;

SidebarHeaderTab.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SidebarHeaderTab;
