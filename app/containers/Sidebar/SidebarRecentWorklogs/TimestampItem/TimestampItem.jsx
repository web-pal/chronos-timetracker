// @flow
import React from 'react';
import moment from 'moment';
import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  stj,
} from 'time-util';

import type {
  Worklog,
} from '../../../../types';

import {
  TimestampContainer,
} from './styled';


type Props = {
  date: any,
  worklogs: Array<Worklog>,
};

const TimestampItem: StatelessFunctionalComponent<Props> = ({
  date,
  worklogs,
}: Props): Node =>
  <TimestampContainer>
    <span>
      {moment(date).calendar()}&nbsp;
    </span>
    <span>
      {stj(worklogs.reduce((total, item) => total + item.timeSpentSeconds, 0), 'h[h] m[m]')}
    </span>
  </TimestampContainer>;

export default TimestampItem;
