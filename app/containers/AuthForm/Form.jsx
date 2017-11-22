import React, { Component } from 'react';
import styled from 'styled-components2';
import { Flex } from 'components';

import calculateSize from 'calculate-size';


const InputMask = styled.span`
  position: absolute;
  top: 10px;
  color: hsla(216, 77%, 23%, 1);
  left: ${props => (!!props.offSet && props.offSet + 1) || 34}px;
`;

const Input = styled.input`
  width: calc(100% - 10px);
  height: 40px;
  min-height: 40px;
  padding-left: 10px;
  margin-bottom: 10px;

  // background: white;
  // border: 2px solid hsla(217, 20%, 80%, 1);
  // border-radius: 3px;

  font-size: 14px;
  letter-spacing: 0;

  background-color: #FAFBFC;
  border: 1px solid #F4F5F7;
  border-radius: 5px;
  color: #091E42;

  &::-webkit-input-placeholder {
    font-size: 14px;
  }
  &:hover {
    background-color: #F4F5F7;
    border-color: #F4F5F7;
  }
  &:focus {
    border-color: #4C9AFF;
    border-width: 2px;
    height: 38px;
    min-height: 38px;
    padding-left: 9px;
    background: white;
  }
`;

const UnderlineInput = styled.input`
  width: calc(100% - 10px);
  height: 40px;
  min-height: 40px;
  font-size: 14px;
  letter-spacing: 0;
  color: #091E42;
  background: white;
  border: 0px;
  border-bottom: 2px solid #0052cc;
  border-radius: 0px;
  padding: 0px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 40px;
  &::-webkit-input-placeholder {
    font-size: 14px;
  }
  &:focus {
    border-color: hsla(216, 49%, 43%, 1);
  }
`;

class MaskField extends Component {
  static defaultProps = {
    autoFocus: false,
  }

  state = { width: 56 };

  onInputChange = (ev) => {
    const size = calculateSize(ev.target.value, {
      font: 'system-ui',
      fontSize: '14px',
      fontWeight: '500',
    });
    this.setState({ width: size.width });
  }

  render() {
    /* eslint-disable react/prop-types */
    const {
      style, underlined, mask, input, type,
      placeholder,
      disabled, autoFocus, onKeyPress,
    } = this.props;
    const { width } = this.state;
    /* eslint-enable react/prop-types */

    return (
      <Flex row spaceBetween style={{ width: '100%', position: 'relative' }}>
        {underlined ?
          <UnderlineInput
            {...input}
            type={type}
            style={style || {}}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(value) => {
              this.onInputChange(value);
              input.onChange(value);
            }}
            autoFocus={autoFocus}
            onKeyPress={onKeyPress}
          />
          :
          <Input
            {...input}
            type={type}
            style={style || {}}
            disabled={disabled}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onKeyPress={onKeyPress}
          />
        }
        {/* mask &&
          <InputMaskValue ref={r => { this.r = r; }}>
            {input.value}
          </InputMaskValue>
        */}
        {mask &&
          <InputMask offSet={width}>
            .atlassian.net
          </InputMask>
        }
      </Flex>
    );
  }
}

// eslint-disable-next-line import/prefer-default-export
export const renderField = props => <MaskField {...props} />;
