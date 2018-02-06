// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  stj,
} from 'time-util';

import {
  ProgressBarContainer,
} from './styled';

import ProgressBarFill from './ProgressBarFill';


type Props = {
  remaining: number,
  loggedTotal: number,
};

// eslint-disable-next-line
const ProgressBar: StatelessFunctionalComponent<Props> = ({
  remaining,
  loggedTotal,
}: Props): Node => (
  <ProgressBarContainer>
    {remaining > 0 &&
      <ProgressBarFill
        name="remaining"
        label="Remaining"
        width={100}
        color="#FFAB00"
        time={stj(remaining)}
        style={{ alignItems: 'flex-end' }}
      />
    }
    <ProgressBarFill
      name="logged-total"
      width={(loggedTotal / (loggedTotal + remaining)) * 100}
      label="Logged"
      color="#B2D4FF"
      time={stj(loggedTotal)}
      style={(remaining === 0) ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }}
    />
  </ProgressBarContainer>
);

export default ProgressBar;
