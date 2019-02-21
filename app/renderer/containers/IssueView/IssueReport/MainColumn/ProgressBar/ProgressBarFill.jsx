// @flow
import React from 'react';
import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import * as S from './styled';


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
  <S.ProgressBarItem width={width} style={style}>
    <S.Time isHighlighted={name === 'you-logged-today'}>{time}</S.Time>
    <S.ProgressBarFill color={color} />
    <S.TimeLabel>{label}</S.TimeLabel>
  </S.ProgressBarItem>
);

export default ProgressBarFillContainer;
