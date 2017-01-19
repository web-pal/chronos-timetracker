import React, { PropTypes } from 'react';

import A from '../../../Base/A/A';

const SidebarItem = ({ onClick, style, item }) => {
  const { active, tracking, id, resolved } = item ? item.toJS() : {};
  const label = item && item.get('key');
  return (
    <li
      className={
        `flex-col flex--center sidebar__item\
        ${active ? 'sidebar__item--active' : ''}\
        ${tracking ? 'sidebar__item--tracking' : ''}`
      }
      onClick={() => onClick(id)}
      style={style}
    >
      {!item && 'NOT LOADED YET'}
      {resolved && <span className="fa fa-check" />}
      <A label={label} />
    </li>
  );
};

SidebarItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  item: PropTypes.object,
};

export default SidebarItem;

