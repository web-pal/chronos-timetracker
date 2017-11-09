// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import Flex from '../../Flex/Flex';

import { PlaceholderContainer, Placeholder } from './styled';

const IssueCommentPlaceholder: StatelessFunctionalComponent<{}> = (): Node => (
  <PlaceholderContainer>
    <Flex row>
      <Placeholder type="avatar" className="animated-background" />
      <Placeholder type="title" className="animated-background" />
    </Flex>
    <Flex column>
      <Placeholder type="body" className="animated-background" />
      <Placeholder type="body2" className="animated-background" />
      <Placeholder type="body3" className="animated-background" />
    </Flex>
  </PlaceholderContainer>
);

export default IssueCommentPlaceholder;
