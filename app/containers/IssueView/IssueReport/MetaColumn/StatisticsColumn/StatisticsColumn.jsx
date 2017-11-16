// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex } from 'components';

import { MetaItem } from './styled';
import { MetaItemName, MetaItemValue, BorderLeft } from '../../styled';

type Props = {
  youLogged: any,
  youLoggedTotal: any,
  loggedTotal: any,
};

// TODO: time values in this component should have next format:
// 4h 20min
// 30min

// eslint-disable-next-line
const StatisticsRow: StatelessFunctionalComponent<Props> = ({
  youLogged,
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
      <BorderLeft color="#FFAB00" />
      <Flex column alignCenter>
        <MetaItemName>Logged by you today</MetaItemName>
        <MetaItemValue>{youLogged}</MetaItemValue>
      </Flex>
      <div />
    </MetaItem>
    <MetaItem>
      <BorderLeft color="#FFF0B2" />
      <Flex column alignCenter>
        <MetaItemName>Total logged by you</MetaItemName>
        <MetaItemValue>{youLoggedTotal}</MetaItemValue>
      </Flex>
      <div />
    </MetaItem>
    <MetaItem>
      <BorderLeft color="#B2D4FF" />
      <Flex column alignCenter>
        <MetaItemName>Total logged</MetaItemName>
        <MetaItemValue>{loggedTotal}</MetaItemValue>
      </Flex>
      <div />
    </MetaItem>
  </Flex>
);

export default StatisticsRow;
