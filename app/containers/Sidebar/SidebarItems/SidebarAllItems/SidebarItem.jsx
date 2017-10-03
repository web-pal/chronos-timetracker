import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { getStatusColor } from 'jiraColors-util';

import Flex from '../../Base/Flex/Flex';
import SidebarItemLoader from '../../Spinners/SidebarItemLoader';

const SidebarItem = ({
  issue, style, summary,
  active, onTracking,
  selectIssue, selectWorklogByIssueId,
}) => {
  if (!issue) {
    return null;
  }
  return (
    <Flex
      row
      className={[
        'SidebarItem',
        `${active ? 'sidebar__item--active' : ''}`,
        `${onTracking ? 'sidebar__item--tracking' : ''}`,
      ].join(' ')}
      onClick={() => {
        selectIssue(issue.get('id'));
        selectWorklogByIssueId(issue.get('id'));
      }}
      style={style}
    >
      <span
        className="SidebarItem__key"
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
        src={
          issue.getIn(['fields', 'priority', 'iconUrl']) ||
          'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
        }
      />
      <img
        className="priorityImg"
        alt="priorityImg"
        src={
          issue.getIn(['fields', 'issuetype', 'iconUrl']) ||
          'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
        }
      />
      {(issue.size > 0) &&
      <span className="SidebarItem__summary">
        {summary}
      </span>
      }
      <SidebarItemLoader show={issue.size === 0} />
    </Flex>
  );
};

SidebarItem.propTypes = {
  selectIssue: PropTypes.func.isRequired,
  selectWorklogByIssueId: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
  issue: ImmutablePropTypes.map.isRequired,
  summary: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onTracking: PropTypes.bool.isRequired,
};

export default SidebarItem;

