// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';

import IssueItemPlaceholder from '../IssueItemPlaceholder/IssueItemPlaceholder';
import Flex from '../../Flex/Flex';

import {
  TimestampPlaceholderContainer,
  TimestampPlaceholder,
} from './styled';

const RecentItemsPlaceholder: StatelessFunctionalComponent<{}> = (): Node => (
  <div className="RecentItems">
    <Flex column className="RecentItems__block">
      <TimestampPlaceholderContainer>
        <TimestampPlaceholder className="animated-background" />
        <TimestampPlaceholder className="animated-background" />
      </TimestampPlaceholderContainer>
      <Flex column className="RecentItems__list">
        <IssueItemPlaceholder />
        <IssueItemPlaceholder />
        <IssueItemPlaceholder />
      </Flex>
    </Flex>
    <Flex column className="RecentItems__block">
      <TimestampPlaceholderContainer>
        <TimestampPlaceholder className="animated-background" />
        <TimestampPlaceholder className="animated-background" />
      </TimestampPlaceholderContainer>
      <Flex column className="RecentItems__list">
        <IssueItemPlaceholder />
        <IssueItemPlaceholder />
      </Flex>
    </Flex>
  </div>
);

export default RecentItemsPlaceholder;
