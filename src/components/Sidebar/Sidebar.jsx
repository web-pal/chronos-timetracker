import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';
import SidebarItems from './SidebarItems/SidebarItems';

const spinner = require('../../assets/images/ring-alt.svg');

const Sidebar = ({
  items, tracking, current, currentProjectId, fetching,
  onItemClick, fetchIssues, issuesCount, sidebarType,
}) =>
  <Flex column className="sidebar">
    {fetching === 'issues' &&
      <img alt="" src={spinner} className="issues-spinner" />
    }
    {currentProjectId
      ? <SidebarItems
        items={items}
        current={current}
        tracking={tracking}
        fetchIssues={fetchIssues}
        onItemClick={onItemClick}
        issuesCount={issuesCount}
        sidebarType={sidebarType}
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
  fetching: PropTypes.string,
  onItemClick: PropTypes.func,
  issuesCount: PropTypes.number,
  sidebarType: PropTypes.string,
  fetchIssues: PropTypes.func.isRequired,
};

export default Sidebar;
