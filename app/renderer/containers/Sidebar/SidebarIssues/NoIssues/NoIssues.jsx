// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  noIssuesImage,
} from 'utils/data/assets';
import * as S from './styled';


const NoIssues: StatelessFunctionalComponent<*> = (): Node => (
  <S.NoIssues>
    <S.NoIssuesImage
      src={noIssuesImage}
      alt="Not found"
    />
    <S.Title>
      No issues found
    </S.Title>
    <S.Subtitle>
      Try to change filters and try again
    </S.Subtitle>
  </S.NoIssues>
);

export default NoIssues;
