import styled from 'styled-components';

export const Feature = styled.div`
  position: relative;
  & > span:last-child {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateX(100%);
  }
`;
