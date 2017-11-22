// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import Flex from '../../Flex/Flex';

import { PlaceholderContainer, Placeholder } from './styled';

const IssueCommentPlaceholder: StatelessFunctionalComponent<{}> = (): Node => (
  <PlaceholderContainer>
    <Flex row>
      <Placeholder type="avatar" />
      <Placeholder type="title" />
    </Flex>
    <Flex column>
      <Placeholder type="body" />
      <Placeholder type="body2" />
      <Placeholder type="body3" />
    </Flex>
  </PlaceholderContainer>
);

export default IssueCommentPlaceholder;
