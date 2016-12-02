import React, { PropTypes } from 'react';

import Flex from '../Base/Flex/Flex';

const TrackerHeader = ({ currentIssue }) => currentIssue.size ?
  <Flex row centered className="tracker-header">
    <Flex column centered>
      {currentIssue.get('key')} - {currentIssue.get('fields').get('description')}
    </Flex>
  </Flex> : false;

TrackerHeader.propTypes = {
  currentIssue: PropTypes.object,
};

export default TrackerHeader;
