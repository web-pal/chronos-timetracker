import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';
import SidebarItems from './SidebarItems/SidebarItems';
import SidebarFilterWrapper from '../../containers/SidebarFilterWrapper';

const Sidebar = ({
  items, tracking, current, currentProjectId, fetching,
  onItemClick, fetchIssues, issuesCount, sidebarType,
  selectRecent, recentSelected,
}) =>
  <Flex column className="sidebar">
    <SidebarFilterWrapper />
    {currentProjectId
      ? <SidebarItems
        items={items}
        current={current}
        tracking={tracking}
        fetchIssues={fetchIssues}
        onItemClick={onItemClick}
        issuesCount={issuesCount}
        sidebarType={sidebarType}
        selectRecent={selectRecent}
        recentSelected={recentSelected}
        fetching={fetching}
      />
      : <span className="sidebar-nothing-selected">
        select project from dropdown above
      </span>
    }
  </Flex>;

Sidebar.propTypes = {
  current: PropTypes.string,
  tracking: PropTypes.string,
  currentProjectId: PropTypes.string,
  items: PropTypes.object,
  onItemClick: PropTypes.func,
  issuesCount: PropTypes.number,
  sidebarType: PropTypes.string,
  fetchIssues: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  selectRecent: PropTypes.func.isRequired,
  recentSelected: PropTypes.string,
};

export default Sidebar;
