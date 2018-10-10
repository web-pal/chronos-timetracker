// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  IssuesReports,
} from 'types';

import {
  stj,
} from 'utils/time-util';

import {
  ProgressBarContainer,
} from './styled';

import CircularProgressBar from './CircularProgressBar';

type Props = {
  time: number,
  report: IssuesReports,
  showLoggedOnStop: boolean,
  onClick: () => {},
};

// eslint-disable-next-line
const ProgressBar: StatelessFunctionalComponent<Props> = ({
  time,
  report,
  showLoggedOnStop,
  onClick,
}: Props): Node => {
  const { loggedTotal, originalestimate, remaining } = report;

  let content = '';
  let percentage = 0;

  if (remaining > 0) {
    percentage = Math.round(((loggedTotal + time) / originalestimate) * 100);
    content = showLoggedOnStop ? `${stj(loggedTotal + time)} / ${percentage}%` : '';

    if (percentage > 100) {
      percentage = 100;
    }
  }

  return (
    <ProgressBarContainer>
      <CircularProgressBar
        percentage={percentage}
        content={content}
        onClick={onClick}
      />
    </ProgressBarContainer>
  );
};

export default ProgressBar;
