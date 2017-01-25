import React, { PropTypes } from 'react';

import Flex from '../components/Base/Flex/Flex';
import SidebarHeader from '../components/Sidebar/SidebarHeader/SidebarHeader';

const SidebarHeaderWrapper = ({ sidebarType, setSidebarType }) =>
  <Flex row className="sidebar-header-wrap">
    <SidebarHeader
      active={sidebarType === 'Recent'}
      label="Recent"
      onClick={setSidebarType}
    />
    <SidebarHeader
      active={sidebarType === 'All'}
      label="All"
      onClick={setSidebarType}
    />
  </Flex>;

SidebarHeaderWrapper.propTypes = {
  sidebarType: PropTypes.string.isRequired,
  setSidebarType: PropTypes.func.isRequired,
};

export default SidebarHeaderWrapper;
