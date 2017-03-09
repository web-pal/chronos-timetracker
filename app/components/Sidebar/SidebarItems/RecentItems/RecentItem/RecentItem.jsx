import React, { PropTypes } from 'react';
import moment from 'moment';
import { getStatusColor } from 'jiraColors-util';
import { jts } from 'time-util';

import Flex from '../../../../Base/Flex/Flex';

function formatSummary(summary) {
  return summary.length > 20 ? `${summary.substr(0, 20)}...` : summary;
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
    {worklogs.toList().reverse().map((w, i) => {
      const issue = w.get('issue');
      const { id, key } = issue.toJS();
      const summary = issue.getIn(['fields', 'summary']);
      const timeSpent = w.get('timeSpent') === '1m' ? '<1m' : w.get('timeSpent');
      return (
        <Flex
          row
          key={i}
          className={`
            RecentItem\
            ${current === id && recentSelected === `${index}_${i}` ? 'active' : ''}\
            ${tracking === id ? 'tracking' : ''}\
          `}
          onClick={() => onClick(issue, i)}
        >
          <span
            className="RecentItem__key"
            style={{
              backgroundColor: getStatusColor(issue.getIn(['fields', 'status', 'statusCategory', 'colorName'])),
            }}
          >{key}</span>
          <img
            className="priorityImg"
            src={issue.getIn(['fields', 'priority', 'iconUrl'])}
          />
          <img
            className="priorityImg"
            src={issue.getIn(['fields', 'issuetype', 'iconUrl'])}
          />
          <span className="RecentItem__summary">{formatSummary(summary)}</span>
          <span className="RecentItem__time flex-item--end">{timeSpent}</span>
          <span className="RecentItem__timest">{moment(w.get('created')).format('HH:mm:ss')}</span>
        </Flex>
      );
    }
    )}
  </Flex>;

RecentItem.propTypes = {
  worklogs: PropTypes.object.isRequired,
  current: PropTypes.string,
  tracking: PropTypes.string,
  recentSelected: PropTypes.string,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RecentItem;
