// @flow
import React from 'react';
import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  ProgressBarItem,
  ProgressBarFill,
  Time,
  TimeLabel,
} from './styled';


type Props = {
  name: string,
  label: string,
  width: number,
  color: string,
  time: string,
  style: any,
};

// eslint-disable-next-line
const ProgressBarFillContainer: StatelessFunctionalComponent<Props> = ({
  name,
  label,
  width,
  color,
  time,
  style,
}: Props): Node => (
  <ProgressBarItem width={width} style={style}>
    <Time isHighlighted={name === 'you-logged-today'}>{time}</Time>
    <ProgressBarFill color={color} />
    <TimeLabel>{label}</TimeLabel>
  </ProgressBarItem>
);

export default ProgressBarFillContainer;
