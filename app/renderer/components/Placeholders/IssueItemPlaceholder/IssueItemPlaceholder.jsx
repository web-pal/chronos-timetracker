// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';

import { PlaceholderContainer, Placeholder } from './styled';
import { AnimatedPlaceholder } from '../styled';

const IssueItemPlaceholder: StatelessFunctionalComponent<{}> = (): Node => (
  <PlaceholderContainer>
    <AnimatedPlaceholder>
      <Placeholder type="issueRight" />
      <Placeholder type="issueBottom" />
      <Placeholder type="descriptionRight" />
      <Placeholder type="descriptionBottom" />
      <Placeholder type="descriptionRightSecond" />
      <Placeholder type="descriptionBottomSecond" />
      <Placeholder type="attributesRight" />
      <Placeholder type="attributesBottom" />
    </AnimatedPlaceholder>
  </PlaceholderContainer>
);

export default IssueItemPlaceholder;
