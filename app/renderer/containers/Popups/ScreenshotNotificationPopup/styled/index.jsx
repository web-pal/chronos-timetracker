import styled from 'styled-components';

export const Popup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-center;
  height: 100%;
  padding: 15px 12px 12px 14px;
`;

export const PopupImage = styled.img`
  height: 70%;
  cursor: ${props => (props.allowToResize ? 'pointer' : 'default')};
`;
