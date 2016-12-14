import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';

const TrackerHeader = ({ currentIssue }) => currentIssue.size ?
  <Flex column className="tracker-header">
    <span className="tracker-header__issuekey">
      {currentIssue.get('key')}
    </span>
    <span className="tracker-header__summary">
      {currentIssue.getIn(['fields', 'summary'])}
    </span>
    <span className="tracker-header__description">
      {currentIssue.getIn(['fields', 'description'])}
    </span>
  </Flex> : false;

TrackerHeader.propTypes = {
  currentIssue: PropTypes.object,
};

export default TrackerHeader;
