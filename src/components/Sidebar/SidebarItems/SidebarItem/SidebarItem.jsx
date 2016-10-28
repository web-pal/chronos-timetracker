import React, { PropTypes } from 'react';

import A from '../../../Base/A/A';

const SidebarItem = ({ onClick, label, active, id }) =>
  <li
    className={
      `flex-col flex--center sidebar__item ${active ? 'sidebar__item--active' : ''}`
    }
    onClick={() => onClick(id)}
  >
    <A label={label} />
  </li>;

SidebarItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  active: PropTypes.bool,
  id: PropTypes.number.isRequired,
};

export default SidebarItem;

