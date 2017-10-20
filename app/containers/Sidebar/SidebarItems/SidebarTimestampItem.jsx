// @flow
import React, { PropTypes } from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import moment from 'moment';
import { stj } from 'time-util';
import { Flex } from 'components';

import type { Worklog } from '../../../types';

type Props = {
  date: any,
  worklogs: Array<Worklog>,
};

const TimestampItem: StatelessFunctionalComponent<Props> = ({
  date,
  worklogs,
}: Props): Node =>
  <Flex row className="RecentItems__timestamp">
    <span>
      {moment(date).calendar()}&nbsp;
    </span>
    <span className="flex-item--end">
      {stj(worklogs.reduce((total, item) => total + item.timeSpentSeconds, 0), 'h[h] m[m]')}
      &nbsp;Total
    </span>
  </Flex>;

export default TimestampItem;
