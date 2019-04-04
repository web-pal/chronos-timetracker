// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import Flex from '../../Flex/Flex';

import * as S from './styled';

const IssueCommentPlaceholder: StatelessFunctionalComponent<{}> = (): Node => (
  <S.MainPlaceholder>
    <Flex row>
      <S.Placeholder type="avatar" />
      <S.Placeholder type="title" />
    </Flex>
    <Flex column>
      <S.Placeholder type="body" />
      <S.Placeholder type="body2" />
      <S.Placeholder type="body3" />
    </Flex>
  </S.MainPlaceholder>
);

export default IssueCommentPlaceholder;
