import React, { PropTypes } from 'react';

import Flex from '../../../Base/Flex/Flex';

const SidebarItem = ({ onClick, style, item }) => {
  const { active, tracking, id, resolved, key, fields } = item.toJS();
  const { summary } = fields || {};
  return (
    <Flex
      row
      className={`SidebarItem
        ${active ? 'sidebar__item--active' : ''}\
        ${tracking ? 'sidebar__item--tracking' : ''}`
      }
      onClick={() => onClick(id)}
      style={style}
    >
      {!item && 'NOT LOADED YET'}
      {resolved && <span className="fa fa-check" />}
      <span className="SidebarItem__key">{key}</span>
      <span className="SidebarItem__summary">{summary}</span>
    </Flex>
  );
};

SidebarItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  item: PropTypes.object,
};

export default SidebarItem;

