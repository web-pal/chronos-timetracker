// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex } from 'components';

import { StatisticsItem } from './styled';
import { MetaItemName, MetaItemValue } from '../../styled';

type Props = {
  estimate: any,
  remaining: any,
};

// TODO: time values in this component should have next format:
// 4h 20min
// 30min

// eslint-disable-next-line
const StatisticsRow: StatelessFunctionalComponent<Props> = ({
  estimate,
  remaining,
}: Props): Node => (
  <Flex row style={{ alignSelf: 'flex-start', marginBottom: 32 }}>
    <StatisticsItem bgTheme="orange" style={{ marginRight: 16 }}>
      <Flex column>
        <MetaItemName>Estimated</MetaItemName>
        <MetaItemValue>{estimate}</MetaItemValue>
      </Flex>
    </StatisticsItem>
    <StatisticsItem bgTheme="white">
      <Flex column>
        <MetaItemName>Remaining</MetaItemName>
        <MetaItemValue>{remaining}</MetaItemValue>
      </Flex>
    </StatisticsItem>
  </Flex>
);

export default StatisticsRow;
