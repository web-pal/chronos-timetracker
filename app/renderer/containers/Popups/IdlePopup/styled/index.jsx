import styled from 'styled-components';

// eslint-disable-next-line import/prefer-default-export
export const Popup = styled.div`
  display: flex;
  flex-direction: column;

  width: 460px;
  height: 100%;
  padding: 10px 20px;
  margin-left: -20px;
  margin-top: -10px;
  & > div {
    height: 100%;
  }
`;
