import React from 'react';
import styled from 'styled-components';
import Flex from '../../components/Base/Flex/Flex';
import { Input } from './styled';

const Mask = styled.span`
  position: absolute;
  margin-top: 13px;
  margin-left: 66px;
  color: hsla(216, 77%, 23%, 1);
`;

export const renderField = ({
  style, mask, input, label, type, placeholder, meta: { touched, error, warning } //eslint-disable-line
}) => (
  <Flex row spaceBetween style={{ width: '100%' }}>
    <Input
      {...input}
      type={type}
      style={style || {}}
      placeholder={placeholder}
    />
    {mask &&
      <Mask>.atlassian.net</Mask>
    }
  </Flex>
);

