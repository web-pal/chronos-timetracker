// @flow
import React from 'react';
import { tasks } from 'utils/data/assets';

import * as S from './styled';

const IssueViewPlaceholder = () => (
  <S.IssueViewPlaceholder>
    <S.NoIssuesImage src={tasks} alt="Not found" />
    <S.Title>Start your tracking experience!</S.Title>
    <S.Subtitle>Select issue from the left in order to start tracking</S.Subtitle>
  </S.IssueViewPlaceholder>
);

export default IssueViewPlaceholder;
