/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';

import {
  AsyncSelect,
} from '@atlaskit/select';


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

export const UsersSelect = styled(AsyncSelect)`
  width: 300px;
  margin-left: 6px;
`;
