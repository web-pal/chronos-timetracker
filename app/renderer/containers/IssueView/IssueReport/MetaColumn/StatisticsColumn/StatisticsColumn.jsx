// @flow
import React from 'react';
import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  stj,
} from 'utils/time-util';
import {
  Flex,
} from 'components';

import {
  MetaItem,
} from './styled';
import * as S from '../../styled';


type Props = {
  youLoggedToday: number,
  youLoggedTotal: number,
  loggedTotal: number,
};

// TODO: time values in this component should have next format:
// 4h 20min
// 30min

// eslint-disable-next-line
const StatisticsRow: StatelessFunctionalComponent<Props> = ({
  youLoggedToday,
  youLoggedTotal,
  loggedTotal,
}: Props): Node => (
  <Flex
    column
    style={{
      justifyContent: 'space-between',
      minHeight: 200,
      width: '100%',
    }}
  >
    <MetaItem>
      <S.BorderLeft color="#FFAB00" />
      <Flex column alignCenter>
        <S.MetaItemName>Logged by you today</S.MetaItemName>
        <S.MetaItemValue>{stj(youLoggedToday)}</S.MetaItemValue>
      </Flex>
      <div />
    </MetaItem>
    <MetaItem>
      <S.BorderLeft color="#FFF0B2" />
      <Flex column alignCenter>
        <S.MetaItemName>Total logged by you</S.MetaItemName>
        <S.MetaItemValue>{stj(youLoggedTotal)}</S.MetaItemValue>
      </Flex>
      <div />
    </MetaItem>
    <MetaItem>
      <S.BorderLeft color="#B2D4FF" />
      <Flex column alignCenter>
        <S.MetaItemName>Total logged</S.MetaItemName>
        <S.MetaItemValue>{stj(loggedTotal)}</S.MetaItemValue>
      </Flex>
      <div />
    </MetaItem>
  </Flex>
);

export default StatisticsRow;
