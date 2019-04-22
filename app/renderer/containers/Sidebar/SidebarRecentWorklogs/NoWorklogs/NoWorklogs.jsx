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


const NoWorklogs: StatelessFunctionalComponent<*> = (): Node => (
  <S.NoWorklogs>
    <S.NoIssuesImage src={noIssuesImage} alt="Not found" />
    <S.Title>
      Nothing tracked recently
    </S.Title>
    <S.Subtitle>
      Track any issue to see it in {'"Recent"'} tab
    </S.Subtitle>
  </S.NoWorklogs>
);

export default NoWorklogs;
