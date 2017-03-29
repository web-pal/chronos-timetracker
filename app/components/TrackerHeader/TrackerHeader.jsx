import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Markdown from 'react-markdown';
import { stj } from 'time-util';

import Flex from '../Base/Flex/Flex';
import IssueInfo from './IssueInfo';

const TrackerHeader = ({ currentIssue, selfLogged }) => {
  const estimate = currentIssue.getIn(['fields', 'timeestimate']);
  const logged = currentIssue.getIn(['fields', 'timespent']);
  const remaining = estimate - logged < 0 ? 0 : estimate - logged;

  return (
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
          You logged: <b>{stj(selfLogged, 'h[h] m[m]')}</b>
        </span>
        <span className="logged">
          Total logged: <b>{stj(logged, 'h[h] m[m]')}</b>
        </span>
        <span className="remaining">
          Remaining: <b>{stj(remaining, 'h[h] m[m] s[s]')}</b>
        </span>
      </Flex>
    </Flex>
  );
};

TrackerHeader.propTypes = {
  currentIssue: ImmutablePropTypes.map.isRequired,
  selfLogged: PropTypes.number.isRequired,
};

export default TrackerHeader;
