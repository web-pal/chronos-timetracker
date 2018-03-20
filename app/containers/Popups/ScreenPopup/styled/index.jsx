import styled from 'styled-components';

export const TrackingViewContainer = styled.div`
`;

export const PopupContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-center;
  height: 100%;
  background: white;
  padding: 15px 12px 12px 14px;
  button {
    height: 33px;
    color: white;
    font-size: 16px;
    padding: 5px 22px;
  }
`;

export const PopupImage = styled.img`
  width: 188px;
  height: 150px;
  margin: 3px;
  object-fit: contain;
  background: #e6e6e6;
`;
