import styled, {
  keyframes,
} from 'styled-components';

const flash = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const RecordIconAnimated = styled.div`
  color: red;
  animation-name: ${flash};
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
`;
