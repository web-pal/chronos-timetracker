// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';

import { RecentItems, RecentItemsBlock, RecentItemsList } from './styled';

import IssueItemPlaceholder from '../IssueItemPlaceholder/IssueItemPlaceholder';
import Flex from '../../Flex/Flex';

import {
  TimestampPlaceholderContainer,
  TimestampPlaceholder,
} from './styled';

const RecentItemsPlaceholder: StatelessFunctionalComponent<{}> = (): Node => (
  <RecentItems>
    <RecentItemsBlock>
      <TimestampPlaceholderContainer>
        <TimestampPlaceholder />
        <TimestampPlaceholder />
      </TimestampPlaceholderContainer>
      <Flex column>
        <IssueItemPlaceholder />
        <IssueItemPlaceholder />
        <IssueItemPlaceholder />
      </Flex>
    </RecentItemsBlock>
    <RecentItemsBlock>
      <TimestampPlaceholderContainer>
        <TimestampPlaceholder />
        <TimestampPlaceholder />
      </TimestampPlaceholderContainer>
      <Flex column>
        <IssueItemPlaceholder />
        <IssueItemPlaceholder />
      </Flex>
    </RecentItemsBlock>
  </RecentItems>
);

export default RecentItemsPlaceholder;
