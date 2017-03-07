import React, { PropTypes } from 'react';

import getStatusColor from '../../../../helpers/jiraColors';
import Flex from '../../../Base/Flex/Flex';
import SidebarItemLoader from '../../../Spinners/SidebarItemLoader';

function formatSummary(summary) {
  return summary && summary.length > 20 ? `${summary.substr(0, 20)}...` : summary;
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
      onClick={() => onClick(item)}
      style={style}
    >
      <span
        className="SidebarItem__key"
        style={{
          backgroundColor: getStatusColor(item.getIn(['fields', 'status', 'statusCategory', 'colorName'])),
        }}
      >
        {key}
      </span>
      <img
        className="priorityImg"
        src={
          item.getIn(['fields', 'priority', 'iconUrl']) ||
          'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
        }
      />
      <img
        className="priorityImg"
        src={
          item.getIn(['fields', 'issuetype', 'iconUrl']) ||
          'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
        }
      />
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

