// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  stj,
} from 'utils/time-util';

import * as S from './styled';

import ProgressBarFill from './ProgressBarFill';


type Props = {
  remaining: number,
  loggedTotal: number,
};

// eslint-disable-next-line
const ProgressBar: StatelessFunctionalComponent<Props> = ({
  remaining,
  loggedTotal,
}: Props): Node => {
  const percentage = Math.round((loggedTotal / (loggedTotal + remaining)) * 100);

  return (
    <S.ProgressBar>
      {remaining > 0
        && (
        <ProgressBarFill
          name="remaining"
          label="Remaining"
          width={100}
          color="#FFAB00"
          time={stj(remaining)}
          style={{ alignItems: 'flex-end' }}
        />
        )
      }
      <ProgressBarFill
        name="logged-total"
        width={percentage}
        label="Logged"
        color="#B2D4FF"
        time={stj(loggedTotal)}
        style={(remaining === 0) ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }}
      />
      {remaining > 0
        && <S.Percentage>{percentage}%</S.Percentage>
      }
    </S.ProgressBar>
  );
};

export default ProgressBar;
