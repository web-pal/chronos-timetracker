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
  StatisticsItem,
} from './styled';
import {
  MetaItemName,
  MetaItemValue,
} from '../../styled';


type Props = {
  estimate: number,
  remaining: number,
};

const StatisticsRow: StatelessFunctionalComponent<Props> = ({
  estimate,
  remaining,
}: Props): Node => (
  <Flex row style={{ alignSelf: 'flex-start', marginBottom: 32 }}>
    <StatisticsItem bgTheme="orange" style={{ marginRight: 16 }}>
      <Flex column>
        <MetaItemName>Estimated</MetaItemName>
        <MetaItemValue>{stj(estimate)}</MetaItemValue>
      </Flex>
    </StatisticsItem>
    <StatisticsItem bgTheme="white">
      <Flex column>
        <MetaItemName>Remaining</MetaItemName>
        <MetaItemValue>{stj(remaining)}</MetaItemValue>
      </Flex>
    </StatisticsItem>
  </Flex>
);

export default StatisticsRow;
