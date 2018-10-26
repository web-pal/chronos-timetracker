// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  noIssuesImage,
} from 'utils/data/assets';
import {
  NoWorklogsContainer,
  NoIssuesImage,
  Title,
  Subtitle,
} from './styled';


const NoWorklogs: StatelessFunctionalComponent<*> = (): Node =>
  <NoWorklogsContainer>
    <NoIssuesImage src={noIssuesImage} alt="Not found" />
    <Title>
      Nothing tracked recently
    </Title>
    <Subtitle>
      Track any issue to see it in {'"Recent"'} tab
    </Subtitle>
  </NoWorklogsContainer>;

export default NoWorklogs;
