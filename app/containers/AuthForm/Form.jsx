import React from 'react';
import styled from 'styled-components';
import Flex from '../../components/Base/Flex/Flex';

const Mask = styled.span`
  position: absolute;
  margin-top: 10px;
  margin-left: 56px;
  color: hsla(216, 77%, 23%, 1);
`;

const Input = styled.input`
  width: calc(100% - 10px);
  height: 40px;
  min-height: 40px;
  padding-left: 10px;
  margin-bottom: 10px;

  background: white;
  border: 2px solid hsla(217, 20%, 80%, 1);
  border-radius: 3px;

  font-size: 14px;
  letter-spacing: 0;

  &::-webkit-input-placeholder {
    font-size: 14px;
  }
  &:focus {
    border-color: hsla(216, 49%, 43%, 1);
  }
  &:hover {
    border-color: hsla(216, 49%, 43%, 1);
  }

//   border: 0px;
//   border-bottom: 2px solid #b3b3b3;
//   border-radius: 0px;
//   padding: 0px;
//   font-size: 16px;
//   font-weight: 500;
//   margin-bottom: 0px;
//   &:hover {
//     border-color: #0052cc;
//   }
//   &:focus {
//     border-color: #0052cc;
//   }
`;

const UnderlineInput = Input.extend`
  border: 0px;
  border-bottom: 2px solid #0052cc;
  border-radius: 0px;
  padding: 0px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 40px;
`;

export const renderField = ({
  style, underlined, mask, input, label, type, placeholder, meta: { touched, error, warning } //eslint-disable-line
}) => (
  <Flex row spaceBetween style={{ width: '100%' }}>
    {underlined ?
      <UnderlineInput
        {...input}
        type={type}
        style={style || {}}
        placeholder={placeholder}
      />
      :
      <Input
        {...input}
        type={type}
        style={style || {}}
        placeholder={placeholder}
      />
    }
    {mask &&
      <Mask>.atlassian.net</Mask>
    }
  </Flex>
);

