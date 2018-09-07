/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';

export const SettingsSectionLabel = styled.a`
  margin-bottom: 15px;
  color: ${props => props.active ? 'black' : '#0052CC'};
  font-weight: ${props => props.active ? '600' : 'normal'};
  cursor: pointer;
`;
export const SettingsSectionContent = styled.div`
  margin-bottom: 30px;
`;
export const Separator = styled.div`
  height: 100%;
  width: 1px;
  min-width: 1px;
  background: #d2d7dc;
  margin: 0px 25px 0px 30px;
`;
export const ContentLabel = styled.span`
  margin-left: 6px;
  margin-bottom: 10px;
  display: block;
  font-weight: 600;
  color: black;
`;
export const CheckboxContainer = styled.div`
  padding: 2px 4px;
  border-radius: 3px;
  cursor: pointer;
  user-select: none;
  :hover {
    background-color: #F4F5F7;
  }
  :active {
    background-color: #B3D4FF;
  }
`;
