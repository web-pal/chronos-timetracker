import React, { PropTypes } from 'react';

import A from '../../../Base/A/A';

const SidebarItem = ({ onClick, label, active, resolved, tracking, id }) =>
  <li
    className={
      `flex-col flex--center sidebar__item\
 ${active ? 'sidebar__item--active' : ''}\
 ${tracking ? 'sidebar__item--tracking' : ''}`
    }
    onClick={() => onClick(id)}
  >
    {resolved && <span className="fa fa-check" />}
    <A label={label} />
  </li>;

SidebarItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  active: PropTypes.bool,
  tracking: PropTypes.bool,
  resolved: PropTypes.bool,
  id: PropTypes.string.isRequired,
};

export default SidebarItem;

