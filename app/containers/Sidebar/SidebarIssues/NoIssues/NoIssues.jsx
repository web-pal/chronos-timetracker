// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  noIssuesImage,
} from 'data/assets';
import {
  NoIssuesContainer,
  NoIssuesImage,
  Title,
  Subtitle,
} from './styled';


const NoIssues: StatelessFunctionalComponent<*> = (): Node =>
  <NoIssuesContainer>
    <NoIssuesImage src={noIssuesImage} alt="Not found" />
    <Title>
      No issues found
    </Title>
    <Subtitle>
      Try to change filters and try again
    </Subtitle>
  </NoIssuesContainer>;

export default NoIssues;
