import React, { PropTypes } from 'react';

import { TabContainer } from './styled';
import SidebarHeaderTab from './SidebarHeaderTab';

const SidebarHeader = ({ sidebarType, setSidebarType }) =>
  <TabContainer>
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
  </TabContainer>;

// <TabIcon src={issuesBlue} alt="" />
// <TabIcon src={recent} alt="" />
// <TabIcon src={star} alt="" />

SidebarHeader.propTypes = {
  sidebarType: PropTypes.string.isRequired,
  setSidebarType: PropTypes.func.isRequired,
};

export default SidebarHeader;
