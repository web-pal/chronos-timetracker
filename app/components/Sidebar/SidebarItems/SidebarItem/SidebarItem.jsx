import React, { PropTypes } from 'react';

import Flex from '../../../Base/Flex/Flex';
import SidebarItemLoader from '../../../Spinners/SidebarItemLoader';

function formatSummary(summary) {
  return summary && summary.length > 25 ? `${summary.substr(0, 25)}...` : summary;
}

const SidebarItem = ({ onClick, style, item, current, tracking }) => {
  const { id, resolved, key, fields } = item.toJS();
  const { summary } = fields || {};
  const active = current === id;
  return (
    <Flex
      row
      className={`SidebarItem
        ${active ? 'sidebar__item--active' : ''}\
        ${tracking && tracking === id ? 'sidebar__item--tracking' : ''}`
      }
      onClick={() => onClick(id)}
      style={style}
    >
      <span className="SidebarItem__key">{key}</span>
      <span className="SidebarItem__summary">{formatSummary(summary)}</span>
      <SidebarItemLoader show={item.size === 0} />
    </Flex>
  );
};

SidebarItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  item: PropTypes.object,
  tracking: PropTypes.string,
};

export default SidebarItem;

