import styled from 'styled-components2';
import { AnimatedPlaceholder } from '../../styled';

export const TimestampPlaceholderContainer = styled.div`
  height: 24px;
  padding: 0px 20px;
  background: #fff;
  text-align: right;
  color: rgba(0, 0, 0, 0.7);
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(151, 151, 151, 0.35);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TimestampPlaceholder = AnimatedPlaceholder.extend`
  background: #F4F5F7;
  border-radius: 15px;
  width: 94px;
  height: 24px;
`;

export const RecentItems = styled.div`
  height: 100%;
  flex: 1;
  background: white;
  z-index: 1;
  overflow-y: overlay;
  overflow-x: hidden;
  &::webkit-scrollbar {
    width: 2px;
  }
`;

export const RecentItemsBlock = styled.div`
  display: flex;
  flex-flow: column nowrap;
  &:last-child {
    padding-bottom: 0;
  }
  padding: 15px 0;
`;
