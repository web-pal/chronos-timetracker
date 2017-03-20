import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { getStatusColor } from 'jiraColors-util';

import Flex from '../../Base/Flex/Flex';

function formatSummary(summary) {
  return summary.length > 20 ? `${summary.substr(0, 20)}...` : summary;
}

const RecentItem = ({ worklog, issue }) =>
  <Flex row className="RecentItem" >
    <span
      className="RecentItem__key"
      style={{
        backgroundColor: getStatusColor(
          issue.getIn(['fields', 'status', 'statusCategory', 'colorName']),
        ),
      }}
    >
      {issue.get('key')}
    </span>

    <img
      className="priorityImg"
      alt="priorityImg"
      src={issue.getIn(['fields', 'priority', 'iconUrl'])}
    />
    <img
      className="priorityImg"
      alt="priorityImg"
      src={issue.getIn(['fields', 'issuetype', 'iconUrl'])}
    />
    <span className="RecentItem__summary">
      {formatSummary(issue.getIn(['fields', 'summary']))}
    </span>
    <span className="RecentItem__time flex-item--end">
      {worklog.get('timeSpent') === '1m' ? '<1m' : worklog.get('timeSpent')}
    </span>
    <span className="RecentItem__timest">
      {moment(worklog.get('created')).format('HH:mm:ss')}
    </span>
  </Flex>;

RecentItem.propTypes = {
  worklog: ImmutablePropTypes.map.isRequired,
  issue: ImmutablePropTypes.map.isRequired,
};

export default RecentItem;
