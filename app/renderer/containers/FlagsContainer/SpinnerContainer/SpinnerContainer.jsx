// @flow
import React from 'react';
import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import Spinner from '@atlaskit/spinner';

import * as S from './styled';

type Props = {
  spinnerTitle: string,
};

const SpinnerContainer: StatelessFunctionalComponent<Props> = ({
  spinnerTitle,
}: Props): Node => (
  <S.SpinnerWrapper>
    <Spinner />
    <S.SpinnerTitle>
      {spinnerTitle}
      <S.SpinnerDot>.</S.SpinnerDot>
      <S.SpinnerDot>.</S.SpinnerDot>
      <S.SpinnerDot>.</S.SpinnerDot>
    </S.SpinnerTitle>
  </S.SpinnerWrapper>
);

export default SpinnerContainer;
