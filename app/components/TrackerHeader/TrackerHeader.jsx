import React, { PropTypes } from 'react';
import Markdown from 'react-markdown';

import getStatusColor from '../../helpers/jiraColors';
import { stj } from '../../helpers/time';
import Avatar from '../Avatar/Avatar';
import Flex from '../Base/Flex/Flex';

const TrackerHeader = ({ currentIssue }) => {
  const estimate = currentIssue.getIn(['fields', 'timeestimate']);
  const logged = currentIssue.getIn(['fields', 'timespent']);
  const remaining = estimate - logged < 0 ? 0 : estimate - logged;

  return currentIssue.size ?
    <Flex column className="tracker-header">
      <Flex row>
        <Flex column>
          <Flex
            row
            style={{
              minHeight: 20
            }}
          >
            <span className="tracker-header__issuekey">
              {currentIssue.get('key')}
            </span>
            <img
              className="priorityImg"
              src={currentIssue.getIn(['fields', 'priority', 'iconUrl'])}
            />
            <img
              className="priorityImg"
              src={currentIssue.getIn(['fields', 'issuetype', 'iconUrl'])}
            />
          </Flex>
          <span className="tracker-header__summary">
            {currentIssue.getIn(['fields', 'summary'])}
          </span>
        </Flex>
        <Flex column>
          <span className="tracker-header__reporter">
            Reporter: {currentIssue.getIn(['fields', 'reporter', 'displayName'])}
          </span>
          <span className="tracker-header__assignee">
            Assignee: {currentIssue.getIn(['fields', 'assignee', 'displayName']) || 'unassigned'}
          </span>
        </Flex>
        <span
          className="tracker-header__status"
          style={{
            backgroundColor: getStatusColor(currentIssue.getIn(['fields', 'status', 'statusCategory', 'colorName']))
          }}
        >
          {currentIssue.getIn(['fields', 'status', 'name'])}
        </span>
      </Flex>
      {currentIssue.getIn(['fields', 'description']) &&
        <span className="tracker-header__description">
          <Markdown source= {currentIssue.getIn(['fields', 'description'])} />
        </span>
      }
      <Flex row className="tracker-header__times flex-item--end">
        <span className="estimate">
          Estimated {stj(estimate, 'h[h]m[m]')}
        </span>
        <span className="logged">
          Logged {stj(logged, 'h[h]m[m]')}
        </span>
        <span className="remaining">
          Remaining {stj(remaining, 'h[h]m[m]s[s]')}
        </span>
      </Flex>
    </Flex> : false;
}

TrackerHeader.propTypes = {
  currentIssue: PropTypes.object,
};

export default TrackerHeader;
