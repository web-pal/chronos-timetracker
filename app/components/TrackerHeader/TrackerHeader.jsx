import React, { PropTypes } from 'react';
import Markdown from 'react-markdown';
import { stj } from 'time-util';

import Flex from '../Base/Flex/Flex';
import IssueInfo from './IssueInfo';

const TrackerHeader = ({ currentIssue }) => {
  const estimate = currentIssue.getIn(['fields', 'timeestimate']);
  const logged = currentIssue.getIn(['fields', 'timespent']);
  const remaining = estimate - logged < 0 ? 0 : estimate - logged;

  return currentIssue.size ?
    <Flex column className="TrackerHeader">
      <IssueInfo currentIssue={currentIssue} />
      {currentIssue.getIn(['fields', 'description']) &&
        <div className="TrackerHeader__description">
          <Markdown source={currentIssue.getIn(['fields', 'description'])} />
        </div>
      }
      <Flex row centerd spaceBetween className="TrackerHeader__times">
        <span className="estimate">
          Estimated: <b>{stj(estimate, 'h[h] m[m]')}</b>
        </span>
        <span className="logged">
          Logged: <b>{stj(logged, 'h[h] m[m]')}</b>
        </span>
        <span className="remaining">
          Remaining: <b>{stj(remaining, 'h[h] m[m] s[s]')}</b>
        </span>
      </Flex>
    </Flex> : false;
};

TrackerHeader.propTypes = {
  currentIssue: PropTypes.object,
};

export default TrackerHeader;
