import styled, {
  keyframes,
} from 'styled-components';

export const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const SpinnerTitle = styled.p`
  margin: 0;
  padding: 0 10px;
  font-size: 14px;
`;

const blink = keyframes`
    0% {
    opacity: .2;
}
  20% {
    opacity: 1;
}
  100% {
    opacity: .2;
}
`;

export const SpinnerDot = styled.span`
  font-size: 14px;
  animation-name: ${blink};
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  
  &:nth-child(3) {
    animation-delay: .3s;
  }
  
  &:nth-child(2) {
    animation-delay: .2s;
  }
  
  &::nth-child(1) {
    animation-delay: .1s;
  } 
`;
