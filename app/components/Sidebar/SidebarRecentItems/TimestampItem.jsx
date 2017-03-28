import React, { PropTypes } from 'react';
import moment from 'moment';
import { stj } from 'time-util';

import Flex from '../../Base/Flex/Flex';

const TimestampItem = ({ date, worklogs }) =>
  <Flex row className="RecentItems__timestamp">
    <span>
      {moment(date).calendar()}&nbsp;
    </span>
    <span className="flex-item--end">
      {stj(worklogs.reduce((total, item) => total + item.get('timeSpentSeconds'), 0), 'h[h] m[m]')}
      &nbsp;Total
    </span>
  </Flex>;

TimestampItem.propTypes = {
  worklogs: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
};

export default TimestampItem;
