import styled from 'styled-components2';

export const Timestamp = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 4px 20px;
  span {
    font-weight: 600;
    font-size: 12px;
    color: #6C798F;
  }
  border-bottom: 1px solid #dfe1e6;
`;

export const RecentItemsContainer = styled.div`
  height: 100%;
  background: #F4F5F7;
  z-index: 1;
  overflow-y: overlay;
  overflow-x: hidden;
`;

export const RecentItemsBlock = styled.div`
  padding: 10px 0;
  display: flex;
  flex-flow: column nowrap;
`;
