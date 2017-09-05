import React, { PropTypes } from 'react';

import Flex from '../../Base/Flex/Flex';
import SidebarHeaderTab from './SidebarHeaderTab';

const SidebarHeader = ({ sidebarType, setSidebarType }) =>
  <Flex row spaceBetween>
    <SidebarHeaderTab
      active={sidebarType === 'Recent'}
      label="Recent"
      onClick={setSidebarType}
    />
    <SidebarHeaderTab
      active={sidebarType === 'All'}
      label="All"
      onClick={setSidebarType}
    />
  </Flex>;

// <TabIcon src={issuesBlue} alt="" />
// <TabIcon src={recent} alt="" />
// <TabIcon src={star} alt="" />

SidebarHeader.propTypes = {
  sidebarType: PropTypes.string.isRequired,
  setSidebarType: PropTypes.func.isRequired,
};

export default SidebarHeader;
