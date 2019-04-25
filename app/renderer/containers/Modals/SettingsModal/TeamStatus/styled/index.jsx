/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';

import UserPicker from '@atlaskit/user-picker';

import Button from '@atlaskit/button';

export const SettingsSectionContent = styled.div`
  margin-bottom: 30px;
`;
export const ContentLabel = styled.span`
  margin-left: 6px;
  margin-bottom: 10px;
  display: block;
  font-weight: 600;
  color: black;
`;

export const UsersPicker = styled(UserPicker)``;

export const SaveButton = styled(Button)`
  display: flex;
  justify-content: center;
`;
