// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';

import { ProgressBarContainer } from './styled';

import ProgressBarFill from './ProgressBarFill';

type Props = {
  remaining: number,
  youLoggedPercent: number,
  youLoggedTotalPercent: number,
  loggedTotalPercent: number,
};

// eslint-disable-next-line
const ProgressBar: StatelessFunctionalComponent<Props> = ({
  remaining,
  youLoggedPercent,
  youLoggedTotalPercent,
  loggedTotalPercent,
}: Props): Node => (
  <ProgressBarContainer>
    <ProgressBarFill
      name="remaining"
      label="Remaining"
      width={100}
      color="#DEEBFF"
      time={remaining}
      style={{ alignItems: 'flex-end' }}
    />
    <ProgressBarFill
      name="logged-total"
      width={loggedTotalPercent}
      label="Total logged"
      color="#B2D4FF"
      time={'3:57'}
      style={{ alignItems: 'flex-end' }}
    />
    <ProgressBarFill
      name="you-logged-total"
      label="Total logged by you"
      width={youLoggedTotalPercent}
      color="#FFF0B2"
      time={'3:33'}
      style={{ alignItems: 'flex-end' }}
    />
    <ProgressBarFill
      name="you-logged-today"
      width={youLoggedPercent}
      label="You logged today"
      color="#FFAB00"
      time={'2:16'}
      style={{ alignItems: 'flex-start' }}
    />
  </ProgressBarContainer>
);

export default ProgressBar;
