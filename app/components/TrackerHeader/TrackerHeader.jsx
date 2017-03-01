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
    <Flex column className="tracker-header" spaceBetween>
      <Flex row style={{ marginBottom: 10 }}>
        <Flex column>
          <Flex row className="issueName">
            <span className="tracker-header__issuekey">
              {currentIssue.get('key')}
            </span>
            <div className="tracker-header__summary">
              <span>
                {currentIssue.getIn(['fields', 'summary'])}
              </span>
            </div>
            <img
              className="priorityImg"
              src={currentIssue.getIn(['fields', 'priority', 'iconUrl'])}
            />
            <img
              className="priorityImg"
              src={currentIssue.getIn(['fields', 'issuetype', 'iconUrl'])}
            />
            <div className="tracker-header__status" >
              <span
                style={{
                  backgroundColor: getStatusColor(currentIssue.getIn(['fields', 'status', 'statusCategory', 'colorName']))
                }}
              >
                {currentIssue.getIn(['fields', 'status', 'name'])}
              </span>
            </div>
          </Flex>
        </Flex>
        <Flex column>
          <div className="tracker-header__reporter">
            <span>
              Reporter: {currentIssue.getIn(['fields', 'reporter', 'displayName'])}
            </span>
          </div>
          <div className="tracker-header__assignee">
            <span>
              Assignee: {currentIssue.getIn(['fields', 'assignee', 'displayName']) || 'unassigned'}
            </span>
          </div>
        </Flex>
      </Flex>
      {currentIssue.getIn(['fields', 'description']) &&
        <div className="tracker-header__description">
          <Markdown source= {currentIssue.getIn(['fields', 'description'])} />
        </div>
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
