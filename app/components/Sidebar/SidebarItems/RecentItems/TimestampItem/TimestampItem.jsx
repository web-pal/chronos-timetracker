import React, { PropTypes } from 'react';
import moment from 'moment';
import { stj } from 'time-util';

import Flex from '../../../../Base/Flex/Flex';

const TimestampItem = ({ date, index, items }) =>
  <Flex row className="RecentItems__timestamp" id={`timestamp_${index}`}>
    <span>
      {moment(date).calendar()}&nbsp;
    </span>
    <span className="flex-item--end">
      {stj(items.reduce((total, item) => total + item.get('timeSpentSeconds'), 0), 'h[h] m[m]')}
      &nbsp;Total
    </span>
  </Flex>;

TimestampItem.propTypes = {
  items: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  index: PropTypes.number,
};

export default TimestampItem;
