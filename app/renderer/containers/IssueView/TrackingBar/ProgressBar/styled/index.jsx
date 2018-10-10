/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';
import {
  Flex,
} from 'components';

export const ProgressBarContainer = styled(Flex).attrs({
  alignCenter: true,
})`
  position: absolute;
  right: 20px;
  bottom: 6px
  cursor: pointer;
`;

export const CircleBackground = styled.circle`
  fill: #172B4D;
  stroke: white;
  cursor: pointer;
`;

export const CircleProgress = styled.circle`
  fill: none;
  stroke: #FFAB00;
  stroke-linecap: round;
  stroke-linejoin: round;
  cursor: pointer;
`;

export const CircleStop = styled.rect`
  fill: white;
  cursor: pointer;
`;
