import React, { PropTypes } from 'react';

import { stj } from '../../../../../helpers/time';
import Flex from '../../../../Base/Flex/Flex';

function formatSummary(summary) {
  return summary.length > 25 ? `${summary.substr(0, 25)}...` : summary;
}

const RecentItem = ({
  worklogs,
  onClick,
  current,
  tracking,
  recentSelected,
  index,
}) =>
  <Flex column className="RecentItems__list">
    {worklogs.toList().map((wGroup, i) => {
      const issue = wGroup.toList().getIn([0, 'issue']);
      const timeSpent = wGroup.toList().reduce((val, w) => val + w.get('timeSpentSeconds'), 0);
      const { id, key } = issue.toJS();
      const summary = issue.getIn(['fields', 'summary']);
      return (
        <Flex
          row
          key={i}
          className={`
            RecentItem\
            ${current === id && recentSelected === index ? 'active' : ''}\
            ${tracking === id ? 'tracking' : ''}\
          `}
          onClick={() => onClick(id)}
        >
          <span className="RecentItem__key">{key}</span>
          <span className="RecentItem__summary">{formatSummary(summary)}</span>
          <span className="RecentItem__time flex-item--end">{stj(timeSpent, 'h[h] m[m]')}</span>
        </Flex>
      )}
    )}
  </Flex>

RecentItem.propTypes = {
  worklogs: PropTypes.object.isRequired,
  current: PropTypes.string,
  tracking: PropTypes.string,
  recentSelected: PropTypes.number,
  index: PropTypes.number.isRequired,
};

export default RecentItem;
