import React, { PropTypes } from 'react';
import moment from 'moment';

import Flex from '../../../Base/Flex/Flex';

moment.locale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    sameElse: 'L',
  },
});

const RecentItem = ({ items, style }) => {
  return (
    <Flex row style={style}>
      <span>{moment(items.toList().getIn([0, 'updated'])).calendar()}</span>
    </Flex>
  );
};

RecentItem.propTypes = {
  items: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};

export default RecentItem;
