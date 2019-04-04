// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';

import IssueItemPlaceholder from '../IssueItemPlaceholder/IssueItemPlaceholder';
import Flex from '../../Flex/Flex';

import * as S from './styled';

const RecentItemsPlaceholder: StatelessFunctionalComponent<{}> = (): Node => (
  <S.RecentItems>
    <S.RecentItemsBlock>
      <S.TimestampPlaceholder>
        <S.TimestampPlaceholderInfo />
        <S.TimestampPlaceholderInfo />
      </S.TimestampPlaceholder>
      <Flex column>
        <IssueItemPlaceholder />
        <IssueItemPlaceholder />
        <IssueItemPlaceholder />
      </Flex>
    </S.RecentItemsBlock>
    <S.RecentItemsBlock>
      <S.TimestampPlaceholder>
        <S.TimestampPlaceholderInfo />
        <S.TimestampPlaceholderInfo />
      </S.TimestampPlaceholder>
      <Flex column>
        <IssueItemPlaceholder />
        <IssueItemPlaceholder />
      </Flex>
    </S.RecentItemsBlock>
  </S.RecentItems>
);

export default RecentItemsPlaceholder;
