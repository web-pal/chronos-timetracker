/* eslint-disable no-confusing-arrow */
import styled from 'styled-components2';
import '../../../../../../assets/fonts/lineto-circular-bold-c.ttf';
import '../../../../../../assets/fonts/lineto-circular-book-c.ttf';

export const ProgressBarContainer = styled.div`
  width: 94%;
  position: relative;
`;

export const ProgressBarItem = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.width || 100}%;
  position: absolute;
  height: 52px;
  justify-content: space-between;
`;

export const ProgressBarFill = styled.div`
  visibility: ${props => props.width === 0 ? 'hidden' : 'visible'};
  width: ${props => props.width || 100}%;
  border-radius: 10px;
  background-color: ${props => props.color};
  position: absolute;
  top: 22px;
  height: 12px;
`;

export const Time = styled.span`
  font-family: Circular-Book !important;
  color: rgba(225, 225, 225, .9);
  font-size: 12px;
  line-height: 23px;
  ${props => props.isHighlighted && `
    color: white;
    font-size: 14px;
    font-family: Circular-Bold !important;
  `}
`;

export const TimeLabel = styled.span`
  font-family: Circular-Book !important;
  color: rgba(225, 225, 225, .7);
  font-size: 10px;
`;
