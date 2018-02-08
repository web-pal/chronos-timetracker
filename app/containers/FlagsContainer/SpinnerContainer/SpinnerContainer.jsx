// @flow
import React from 'react';
import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import Spinner from '@atlaskit/spinner';

import {
  SpinnerWrapper,
  SpinnerTitle,
  SpinnerDot,
} from './styled';

type Props = {
  spinnerTitle: string,
}

const SpinnerContainer: StatelessFunctionalComponent<Props> = ({
  spinnerTitle,
}: Props): Node => (
  <SpinnerWrapper>
    <Spinner />
    <SpinnerTitle>
      {spinnerTitle}
      <SpinnerDot>.</SpinnerDot>
      <SpinnerDot>.</SpinnerDot>
      <SpinnerDot>.</SpinnerDot>
    </SpinnerTitle>
  </SpinnerWrapper>
);

export default SpinnerContainer;
