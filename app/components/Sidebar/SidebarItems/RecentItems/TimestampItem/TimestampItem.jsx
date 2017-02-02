import React, { PropTypes } from 'react';
import moment from 'moment';

import Flex from '../../../../Base/Flex/Flex';

const TimestampItem = ({ date, index }) =>
  <Flex row className="RecentItems__timestamp" id={`timestamp_${index}`}>
    <span className="flex-item--center">
      {moment(date).calendar()}
    </span>
  </Flex>;

TimestampItem.propTypes = {
  date: PropTypes.string.isRequired,
  index: PropTypes.number,
};

export default TimestampItem;
