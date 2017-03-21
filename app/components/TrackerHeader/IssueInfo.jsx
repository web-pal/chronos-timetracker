import React, { PropTypes } from 'react';
import { getStatusColor } from 'jiraColors-util';

import Flex from '../Base/Flex/Flex';

const IssueInfo = ({ currentIssue }) =>
  <Flex
    row
    spaceBetween
    className="IssueInfo"
    style={{
      paddingTop: process.platform !== 'darwin' ? 30 : 15,
    }}
  >
    <Flex column>
      <Flex row className="issueName">
        <span className="TrackerHeader__issuekey">
          {currentIssue.get('key')}
        </span>
        <img
          className="priorityImg"
          src={currentIssue.getIn(['fields', 'priority', 'iconUrl'])}
          alt=""
        />
        <img
          className="priorityImg"
          src={currentIssue.getIn(['fields', 'issuetype', 'iconUrl'])}
          alt=""
        />
      </Flex>
      <Flex row>
        <div className="TrackerHeader__summary">
          <span>
            {currentIssue.getIn(['fields', 'summary'])}
          </span>
        </div>
      </Flex>
    </Flex>
    <Flex column>
      <div className="TrackerHeader__reporter">
        <span>
          Reporter: <b>{currentIssue.getIn(['fields', 'reporter', 'displayName'])}</b>
        </span>
      </div>
      <div className="TrackerHeader__assignee">
        <span>
          Assignee: <b>{currentIssue.getIn(['fields', 'assignee', 'displayName']) || 'unassigned'}</b>
        </span>
      </div>
    </Flex>
    <Flex column>
      <div className="TrackerHeader__status" >
        <span
          style={{
            borderColor: getStatusColor(currentIssue.getIn(['fields', 'status', 'statusCategory', 'colorName']), 1),
            color: getStatusColor(currentIssue.getIn(['fields', 'status', 'statusCategory', 'colorName']), 1),
          }}
        >
          {currentIssue.getIn(['fields', 'status', 'name'])}
        </span>
      </div>
    </Flex>
  </Flex>;

IssueInfo.propTypes = {
  currentIssue: PropTypes.object.isRequired,
};

export default IssueInfo;
