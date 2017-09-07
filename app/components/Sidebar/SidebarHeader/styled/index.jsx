/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';

export const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 53px;
`;

export const Tab = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
  color: white;
  background-color: white;
  border-bottom: 2px solid ${props => props.active ? props.theme.primary : '#E1E4E9'};
  color: ${props => props.active ? props.theme.primary : '#42526E'};
  font-weight: 500;
  cursor: pointer;
  :hover {
    color: ${props => props.theme.primary};
  }
`;

export const TabIcon = styled.img`
  height: 14px;
  margin-right: 5px;
`;
