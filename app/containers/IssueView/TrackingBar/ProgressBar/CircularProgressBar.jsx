// @flow
import React from 'react';
import Tooltip from '@atlaskit/tooltip';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  CircleStop,
  CircleProgress,
  CircleBackground,
} from './styled';

type Props = {
  content?: Node,
  percentage?: number,
  onClick: () => {},
};

const CircularProgressBar: StatelessFunctionalComponent<Props> = ({
  content,
  percentage,
  onClick,
}: Props): Node => {
  // options
  const sqSize = 60;
  const strokeWidth = 5;

  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  const radius = (sqSize - strokeWidth) / 2;
  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2;
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - ((dashArray * percentage) / 100);

  return (
    <Tooltip
      content={content}
      position="left"
      delay={200}
    >
      <svg
        width={sqSize}
        height={sqSize}
        viewBox={viewBox}
        onClick={onClick}
      >
        <CircleBackground
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
        />
        <CircleProgress
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
          style={{
              strokeDasharray: dashArray,
              strokeDashoffset: dashOffset,
            }}
        />
        <CircleStop
          x="20"
          y="20"
          rx="1"
          width="20"
          height="20"
        />
      </svg>
    </Tooltip>
  );
};

CircularProgressBar.defaultProps = {
  content: null,
  percentage: 0,
};

export default CircularProgressBar;
