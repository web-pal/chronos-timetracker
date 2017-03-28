import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { getStatusColor } from 'jiraColors-util';

import Flex from '../../Base/Flex/Flex';

const RecentItem = ({
  worklog, issue, summary,
  selectIssue, selectWorklog,
  activeGroup, active, onTracking,
}) =>
  <Flex
    row
    className={[
      'RecentItem',
      `${(activeGroup && !active) ? 'activeGroup' : ''}`,
      `${active ? 'active' : ''}`,
      `${onTracking ? 'tracking' : ''}`,
    ].join(' ')}
    onClick={() => {
      selectIssue(issue.get('id'));
      selectWorklog(worklog.get('id'));
    }}
  >
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
      {summary}
    </span>
    <span className="RecentItem__time flex-item--end">
      {worklog.get('timeSpent') === '1m' ? '<1m' : worklog.get('timeSpent')}
    </span>
    <span className="RecentItem__timest">
      {moment(worklog.get('created')).format('HH:mm:ss')}
    </span>
  </Flex>;

RecentItem.propTypes = {
  selectIssue: PropTypes.func.isRequired,
  selectWorklog: PropTypes.func.isRequired,
  worklog: ImmutablePropTypes.map.isRequired,
  issue: ImmutablePropTypes.map.isRequired,
  summary: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  activeGroup: PropTypes.bool.isRequired,
  onTracking: PropTypes.bool.isRequired,
};

export default RecentItem;
